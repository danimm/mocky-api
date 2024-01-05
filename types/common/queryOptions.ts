import {
    DocumentData,
    DocumentSnapshot,
    QueryLimitConstraint,
    QueryOrderByConstraint,
    QueryStartAtConstraint,
} from "@firebase/firestore";

export type QueryOptionsConstrains = (QueryLimitConstraint | QueryOrderByConstraint | QueryStartAtConstraint)[]

export interface FetchFromCollectionOptions<T> {
    perPage?: number;
    startAfter?: string;
    orderBy?: keyof T;
    transform?: (data: T[]) => T[];
}

export interface QueryOptions<T> {
    page?: string;
    perPage?: number;
    startAfter?: null | DocumentSnapshot<T, DocumentData>;
}
