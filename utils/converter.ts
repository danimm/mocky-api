import { FirestoreDataConverter } from "@firebase/firestore";

// This helper function pipes your types through a firestore converter
export const useConverter = <T>() => {
    const converter: FirestoreDataConverter<T> = {
        toFirestore: (data) => data,
        fromFirestore: (snap) => snap.data() as T
    }

    return converter;
}
