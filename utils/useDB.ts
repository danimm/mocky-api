import {
    getFirestore,
    getDocs, getDoc, query, where,
    getCountFromServer, documentId, DocumentSnapshot,
    DocumentData, QueryConstraint, Query, addDoc,
} from "@firebase/firestore";

import { type FetchFromCollectionOptions } from "../types/common/queryOptions";
import { type EventHandlerRequest, H3Event } from "h3";

import { app } from "../firebase";
import { AvailableMockData, MockDataMap } from "../types/availableMockData";
import { useQueryPagination } from "./useQueryPagination";
import { usePaginator } from "./usePaginator";
import firebase from "firebase/compat";
import CollectionReference = firebase.firestore.CollectionReference;
import {collection} from "firebase/firestore";

export function useDB(event?:  H3Event<EventHandlerRequest>) {
    const db = getFirestore(app);

    async function fetchFromCollection
    <MockDataKey extends AvailableMockData, ResultType = MockDataMap[MockDataKey][0], MetadataType = MockDataMap[MockDataKey][1]>
        (collectionName: MockDataKey, options?: FetchFromCollectionOptions<ResultType>): Promise<[data: ResultType[] | null, metadata: MetadataType | null]>
    async function fetchFromCollection
    <MockDataKey extends AvailableMockData, ResultType = MockDataMap[MockDataKey][0], MetadataType = MockDataMap[MockDataKey][1]>
        (collectionName: MockDataKey, options: FetchFromCollectionOptions<ResultType> = {}): Promise<[data: ResultType[] | null, metadata: MetadataType | null]>
    {
        const {
            useCollectionRef,
            useDocumentRef,
            getDocument,
            getDocsData,
            getDocData,
        } = useFirestore<ResultType>(db, collectionName)

        // Prepare the references
        const collectionRef = useCollectionRef()
        const metadataQuery = useDocumentRef<MetadataType>('metadata')
        let lastDocument: null | DocumentSnapshot<ResultType, DocumentData>  = null

        const opts: FetchFromCollectionOptions<ResultType> = {
            disableSort: true,
            ...options,
        }

        // Queries and pagination
        if (opts.startAfter) lastDocument = await getDocument(opts.startAfter)

        let allDocumentsQuery: CollectionReference<ResultType> | Query<ResultType> = collectionRef
        if (opts.query) {
            const [field, optStr, value] = opts.query
            allDocumentsQuery = query(collectionRef, where(field, optStr, value))
        }
        if (!opts.disableSort) {
            allDocumentsQuery = query(
                collectionRef,
                // TODO: Infer the type of the query based on the existence of the createdAt field
                where('created_at', "!=", ''), // available in downloads right now
                ...useQueryPagination<ResultType>({...opts, startAfter: lastDocument })
            )
        }

        const countDocumentsQuery = query(collectionRef, where(documentId(), "!=", 'metadata'))

        // Fetch the data
        const [
            dataPromise,
            metadataPromise,
            totalCountPromise,
        ] = await Promise.allSettled([
            getDocs(allDocumentsQuery),
            getDoc(metadataQuery),
            getCountFromServer(countDocumentsQuery)
        ])

        // TODO: Improve error handler and typing

        // Prepare the data
        const lastPosition = dataPromise.status === 'fulfilled' ? dataPromise.value.docs.at(-1) : null
        const totalCount = totalCountPromise.status === 'fulfilled' ? totalCountPromise.value.data().count : 0
        const data = dataPromise.status === 'fulfilled' && !dataPromise.value?.empty ? getDocsData(dataPromise.value) : []

        // TODO: Try to implement & type transform callback
        // getDocsData(dataPromise.value, options.transform)

        const metadata =  metadataPromise.status === 'fulfilled' && metadataPromise.value.exists()
            ? {
                ...getDocData(metadataPromise.value),
                ...usePaginator({
                    url: event ? getRequestURL(event) : new URL(''),
                    lastPositionId: lastPosition?.ref.id,
                    options: opts,
                    totalCount
                })
            }
            : null

        return [data, metadata];
    }

    async function addDocumentToCollection(collectionName: AvailableMockData, body: unknown) {
        return await addDoc(collection(db, collectionName), body)
    }

    return { fetchFromCollection, addDocumentToCollection, db }
}
