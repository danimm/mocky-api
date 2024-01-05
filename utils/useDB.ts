import {
    getFirestore,
    getDocs,
    getDoc,
    query,
    where,
    DocumentData,
    getCountFromServer,
    documentId,
    DocumentSnapshot,
} from "@firebase/firestore";

import { app } from "../firebase";
import { AvailableMockData, MockDataMap } from "../types/availableMockData";
import { FetchFromCollectionOptions } from "../types/common/queryOptions";
import { useQueryPagination } from "./useQueryPagination";
import { EventHandlerRequest, H3Event } from "h3";
import { usePaginator } from "./usePaginator";

export function useDB(event?:  H3Event<EventHandlerRequest>) {
    const db = getFirestore(app);

    async function fetchFromCollection
    <MockDataKey extends AvailableMockData, ResultType = MockDataMap[MockDataKey][0], MetadataType = MockDataMap[MockDataKey][1]>
        (collectionName: MockDataKey, options?: FetchFromCollectionOptions<ResultType>): Promise<[data: ResultType[] | null, metadata: MetadataType | null]>
    async function fetchFromCollection
    <MockDataKey extends AvailableMockData, ResultType = MockDataMap[MockDataKey][0], MetadataType = MockDataMap[MockDataKey][1]>
        (collectionName: MockDataKey, options: FetchFromCollectionOptions<ResultType> = {}): Promise<[data: ResultType[] | null, metadata: MetadataType | null]> {

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
            const [
                dataPromise,
                metadataPromise,
                totalCountPromise
            ] = await Promise.allSettled([
                getDocs(allDocumentsQuery),
                getDoc(metadataQuery),
                getCountFromServer(countDocumentsQuery)
            ])

            const lastPosition = dataPromise.status === 'fulfilled' && dataPromise.value.docs.at(-1)
            const totalCount = totalCountPromise.status === 'fulfilled' ? totalCountPromise.value.data().count : 0

            // Prepare the data
            const data = dataPromise.status === 'fulfilled' && !dataPromise.value?.empty
                ? getDocsData(dataPromise.value)
                : null

                // TODO: Use & type transform
                // getDocsData(dataPromise.value, options.transform)

            const metadata =  metadataPromise.status === 'fulfilled' &&  metadataPromise.value.exists()
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

            return [
                data,
                metadata,
            ];
    }

    return { fetchFromCollection, db }
}
