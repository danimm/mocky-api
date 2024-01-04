import {
    getFirestore,
    collection,
    getDocs,
    getDoc,
    query,
    where,
    DocumentReference,
    startAt,
    DocumentData,
    CollectionReference,
    doc, getCountFromServer, documentId,
} from "@firebase/firestore";

import { app } from "../firebase";
import { useConverter } from "./converter";
import { AvailableMockData } from "../types/availableMockData";
import type { QueryOptions, QueryOptionsConstrains } from "../types/common/queryOptions";
import { useQueryPagination } from "./useQueryPagination";

export function useDB() {
    const db = getFirestore(app);
    const mockDataCollectionReference = collection(db, "mockData")

    // TODO: Error handler
    async function fetchMockData<T>(name: AvailableMockData, collectionRef: CollectionReference<DocumentData, DocumentData> = mockDataCollectionReference) {
        // Generic type T is inferred from the CollectionRef
        const ref = collectionRef.withConverter(useConverter<T>());
        const q = query(ref, where("name", "==", name));
        return await getDocs(q);
    }

    async function fetchFromCollection<T, M = unknown>(collectionName: AvailableMockData, options?: QueryOptions<T>): Promise<[data: T[] | undefined, metadata: M | null]>
    async function fetchFromCollection<T, M = unknown>(collectionName: AvailableMockData, options: QueryOptions<T> = {}): Promise<[data: T[], metadata: M | null]> {
        // Prepare the references
        const collectionRef = collection(db, collectionName).withConverter(useConverter<T>())
        const metadataQuery = doc(db, collectionName, 'metadata').withConverter(useConverter<M>())

        // Queries and pagination
        const allDocumentsQuery = query(
            collectionRef,
            // TODO: remove this for generic use
            where('created_at', "!=", ''),
            ...useQueryPagination<T>(options)
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

        // TODO: get URL from the route
        const loadMore = new URL('http://localhost:3000/downloads')
        loadMore.searchParams.set('page', lastPosition.ref.id)

        // Prepare the data
        const data = dataPromise.status === 'fulfilled' && !dataPromise.value?.empty
            ? dataPromise.value.docs.map((doc) => doc.data())
            : undefined

        const metadata = metadataPromise.status === 'fulfilled' &&  metadataPromise.value.exists()
            ? metadataPromise.value.data()
            : null

        return [
            data,
            {
                ...metadata,
                paginator: {
                    count: totalCount,
                    num_pages: Math.round(totalCount / options.perPage),
                    per_page: options.perPage,
                    has_next: true,
                    current_page: options.page || 1,
                    load_more: loadMore,
                    translations: '',
                }
            }
        ];
    }

    // TODO: Error handler
    async function fetchSubCollection<T>(docRef: DocumentReference<DocumentData, DocumentData>, path: string) {
        // Generic type T is inferred from the CollectionRef
        const subCollectionRef = collection(docRef, path).withConverter(useConverter<T>());
        const snapshot = await getDocs(subCollectionRef)
        return snapshot.docs.map((doc) => doc.data())
    }

    return { fetchMockData, fetchSubCollection, fetchFromCollection, db }
}
