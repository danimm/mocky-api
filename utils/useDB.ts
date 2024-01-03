import {
    getFirestore,
    collection,
    getDocs,
    getDoc,
    query,
    where,
    DocumentReference,
    documentId,
    DocumentData,
    CollectionReference, doc, QuerySnapshot, DocumentSnapshot,
} from "@firebase/firestore";

import { app } from "../firebase";
import { useConverter } from "./converter";
import { AvailableMockData } from "../types/availableMockData";

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

    async function fetchFromCollection<T, M = unknown>(collectionName: AvailableMockData): Promise<[data: T[], metadata: M | null]> {
        // Prepare the references
        const collectionRef = collection(db, collectionName).withConverter(useConverter<T>())
        const documents = query(collectionRef, where(documentId(), "!=", 'metadata'))
        const metadataRef = doc(db, collectionName, 'metadata').withConverter(useConverter<T>())

        // Fetch the data
        const [
            dataPromise,
            metadataPromise
        ]: [
            dataPromise: PromiseSettledResult<QuerySnapshot<T, DocumentData>>,
            metadataPromise: PromiseSettledResult<DocumentSnapshot<DocumentData>>
        ] = await Promise.allSettled([getDocs(documents), getDoc(metadataRef)])

        // Prepare the data
        const documentsSnapshot = dataPromise.status === 'fulfilled'
            ? dataPromise.value as QuerySnapshot<T, DocumentData>
            : [] as unknown as QuerySnapshot<T, DocumentData>

        const metadata: M | null = metadataPromise.status === 'fulfilled' &&  metadataPromise.value.exists()
            ? metadataPromise.value.data() as M
            : null

        return [
            documentsSnapshot.docs.map((doc) => doc.data()),
            metadata
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
