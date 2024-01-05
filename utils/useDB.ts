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
    doc,
    getCountFromServer,
    documentId,
    DocumentSnapshot,
    QuerySnapshot,
    AggregateField,
    AggregateQuerySnapshot,
    Firestore,
} from "@firebase/firestore";

import { app } from "../firebase";
import { useConverter } from "./converter";
import { AvailableMockData } from "../types/availableMockData";
import {FetchFromCollectionOptions, QueryOptions, QueryOptionsConstrains} from "../types/common/queryOptions";
import { useQueryPagination } from "./useQueryPagination";

export function useDB() {
    const db = getFirestore(app);
    const mockDataCollectionReference = collection(db, "mockData")

    async function fetchFromCollection<T, M = unknown>(collectionName: AvailableMockData, options?: FetchFromCollectionOptions<T>): Promise<[data: T[] | undefined, metadata: M | null]>
    async function fetchFromCollection<T, M = unknown>(collectionName: AvailableMockData, options: FetchFromCollectionOptions<T> = {}): Promise<[data: T[], metadata: M | null]> {
        const { useCollectionRef, useDocumentRef, getDocument } = useFirestore<T>(db, collectionName)

        // Prepare the references
        // const collectionRef = collection(db, collectionName).withConverter(useConverter<T>())
        // const metadataQuery = doc(db, collectionName, 'metadata').withConverter(useConverter<M>())
        const collectionRef = useCollectionRef()
        const metadataQuery = useDocumentRef<M>('metadata')
        let lastDocument: null | DocumentSnapshot<T, DocumentData>  = null


        // Queries and pagination
        if (options.startAfter)
            lastDocument = await getDocument(options.startAfter)
            // lastDocument = await getDoc(doc(db, collectionName, options.startAfter).withConverter(useConverter<T>()))

        console.log('lastDocument', lastDocument)
        const allDocumentsQuery = query(
            collectionRef,
            // TODO: remove this for generic use
            where('created_at', "!=", ''),
            ...useQueryPagination<T>({...options, startAfter: lastDocument })
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
            ? dataPromise.value.docs.map((doc) => {
                return { ...doc.data(), created_at: doc.data()['created_at'].toDate() }
            })
            : undefined

        const metadata = metadataPromise.status === 'fulfilled' &&  metadataPromise.value.exists()
            ? metadataPromise.value.data()
            : null

        const numPages = Math.ceil(totalCount / options.perPage)

        return [
            data,
            {
                ...metadata,
                // TODO: Abstract this
                paginator: {
                    count: totalCount,
                    num_pages: numPages,
                    per_page: options.perPage,
                    has_next: (options.perPage * 2) < totalCount,
                    current_page: options.startAfter || 1,
                    load_more: loadMore,
                    translations: '',
                }
            }
        ];
    }

    return { fetchFromCollection, db }
}
