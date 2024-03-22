import {
    Firestore,
    collection, doc, getDoc, getDocs, updateDoc,
    DocumentReference,QuerySnapshot, DocumentSnapshot, QueryDocumentSnapshot,
    DocumentData
} from "@firebase/firestore";

import { AvailableMockData } from "../types/availableMockData";
import { useConverter } from "./converter";
import { TransformCallback } from "../types/common/queryOptions";

export function useFirestore<T>(db: Firestore, collectionName: AvailableMockData) {
    function useCollectionRef(...pathSegments: string[]) {
        return collection(db, collectionName, ...pathSegments).withConverter(useConverter<T>())
    }

    function useDocumentRef<K = T>(...pathSegments: string[]) {
        return doc(db, collectionName, ...pathSegments).withConverter(useConverter<K>())
    }

    function getDocument(...pathSegments: string[]) {
        return getDoc(useDocumentRef(...pathSegments))
    }

    function updateDocument(docId: string, payload: Record<string, unknown>): Promise<unknown> {
        return updateDoc(useDocumentRef<T>(docId), payload)
    }

    // TODO: Error handler
    async function fetchSubCollection<T>(docRef: DocumentReference<DocumentData, DocumentData>, path: string) {
        const subCollectionRef = collection(docRef, path).withConverter(useConverter<T>());
        const snapshot = await getDocs(subCollectionRef)
        return snapshot.docs.map((doc) => doc.data())
    }

    function defaultTransformer<T>(data: QueryDocumentSnapshot<T, DocumentData>): T {
        return data.data() as T;
    }

    // Get data
    function getDocsData<K>(
        snapshot: QuerySnapshot<K, DocumentData>,
        transform?: TransformCallback<K>) {
        return snapshot.docs.map((doc) => {
            return transform ? transform(doc) : doc.data()
        })
    }

    function getDocData<K>(snapshot: DocumentSnapshot<K, DocumentData>) {
        return snapshot.data()
    }

    return  {
        // Fetch Data
        useCollectionRef,
        useDocumentRef,
        getDocument,
        updateDocument,
        fetchSubCollection,
        // Parse Data
        getDocsData,
        getDocData,
    }
}
