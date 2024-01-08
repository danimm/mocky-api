import {
    getFirestore,
    getDocs, getDoc, query, where,
    getCountFromServer, documentId, DocumentSnapshot,
    DocumentData,
} from "@firebase/firestore";

import { type FetchFromCollectionOptions } from "../types/common/queryOptions";
import { type DataResponse } from "../types/common/response";
import { type EventHandlerRequest, H3Event } from "h3";

import { app } from "../firebase";
import { AvailableMockData, MockDataMap } from "../types/availableMockData";
import { useQueryPagination } from "./useQueryPagination";
import { usePaginator } from "./usePaginator";

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


        // Queries and pagination
        if (options.startAfter) lastDocument = await getDocument(options.startAfter)

        const allDocumentsQuery = query(
            collectionRef,
            // TODO: remove this for generic use
            where('created_at', "!=", ''),
            ...useQueryPagination<ResultType>({...options, startAfter: lastDocument })
        )

        const countDocumentsQuery = query(collectionRef, where(documentId(), "!=", 'metadata'))

        // Fetch the data
        const response = await Promise.allSettled([
            getDocs(allDocumentsQuery),
            getDoc(metadataQuery),
            getCountFromServer(countDocumentsQuery)
        ])

        // TODO: Improve error handler and typing
        if (response.some(({ status }) => status === 'rejected')) return [null, null]

        const [dataPromise, metadataPromise, totalCountPromise] = response as DataResponse<ResultType, MetadataType>

        // Prepare the data
        const lastPosition = dataPromise.value.docs.at(-1)
        const totalCount = totalCountPromise.value.data().count || 0
        const data = !dataPromise.value?.empty ? getDocsData(dataPromise.value) : null
        // TODO: Try to implement & type transform callback
        // getDocsData(dataPromise.value, options.transform)

        const metadata =  metadataPromise.value.exists()
            ? {
                ...getDocData(metadataPromise.value),
                ...usePaginator({
                    url: event ? getRequestURL(event) : new URL(''),
                    lastPositionId: lastPosition.ref.id,
                    options,
                    totalCount
                })
            }
            : null

        return [data, metadata];
    }

    return { fetchFromCollection, db }
}
