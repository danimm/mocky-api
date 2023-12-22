import {
    getFirestore,
    collection,
    doc,
    getDocs,
    query,
    where,
    DocumentReference,
    DocumentData,
    FirestoreDataConverter, CollectionReference,
} from "@firebase/firestore";
import { app } from "../firebase";
import { useConverter } from "./converter";

export function useDB() {
    const db = getFirestore(app);
    const mockDataCollectionReference = collection(db, "mockData")

    async function fetchMockData<T>(name: string, collectionRef: CollectionReference<DocumentData, DocumentData> = mockDataCollectionReference) {
        // Generic type T is inferred from the CollectionRef
        const ref = collectionRef.withConverter(useConverter<T>());
        const q = query(ref, where("name", "==", name));
        return await getDocs(q);
    }

    async function fetchSubCollection<T>(docRef: DocumentReference<DocumentData, DocumentData>, path: string) {
        // Generic type T is inferred from the CollectionRef
        const subCollectionRef = collection(docRef, path).withConverter(useConverter<T>());
        const snapshot = await getDocs(subCollectionRef)
        return snapshot.docs.map((doc) => doc.data())
    }

    return {
        fetchMockData,
        fetchSubCollection,
    }
}
