import {
    collection,
    doc,
    Firestore,
    getDoc,
    DocumentReference,
    DocumentData,
    getDocs,
    CollectionReference, query, where
} from "@firebase/firestore";
import { AvailableMockData } from "../types/availableMockData";
import { useConverter } from "./converter";

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

    // TODO: Error handler
    async function fetchSubCollection<T>(docRef: DocumentReference<DocumentData, DocumentData>, path: string) {
        const subCollectionRef = collection(docRef, path).withConverter(useConverter<T>());
        const snapshot = await getDocs(subCollectionRef)
        return snapshot.docs.map((doc) => doc.data())
    }

    return  { useCollectionRef, useDocumentRef, getDocument, fetchSubCollection }
}
