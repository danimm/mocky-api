import {
    DocumentData,
    DocumentSnapshot, QueryDocumentSnapshot,
    QueryLimitConstraint,
    QueryOrderByConstraint,
    QueryStartAtConstraint,
} from "@firebase/firestore";

export type TransformCallback<T, U = T> = (data: QueryDocumentSnapshot<T, DocumentData>) => U

export type QueryOptionsConstrains = (QueryLimitConstraint | QueryOrderByConstraint | QueryStartAtConstraint)[]

export interface FetchFromCollectionOptions<T> {
    perPage?: number;
    startAfter?: string;
    orderBy?: keyof T;
    transform?: TransformCallback<T>;
}

export interface QueryOptions<T> {
    page?: string;
    perPage?: number;
    startAfter?: null | DocumentSnapshot<T, DocumentData>;
}
