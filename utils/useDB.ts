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
        const metadataRef = doc(db, collectionName, 'metadata').withConverter(useConverter<M>())

        // Fetch the data
        const [
            dataPromise,
            metadataPromise
        ] = await Promise.allSettled([getDocs(documents), getDoc(metadataRef)])

        // Prepare the data
        const data = dataPromise.status === 'fulfilled' && !dataPromise.value.empty
            ? dataPromise.value.docs.map((doc) => doc.data())
            : []

        const metadata = metadataPromise.status === 'fulfilled' &&  metadataPromise.value.exists()
            ? metadataPromise.value.data()
            : null

        return [data, metadata];
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
