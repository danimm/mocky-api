import {
    DocumentData,
    DocumentSnapshot, QueryDocumentSnapshot,
    QueryLimitConstraint,
    QueryOrderByConstraint,
    QueryStartAtConstraint, WhereFilterOp,
} from "@firebase/firestore";
import firebase from "firebase/compat";
import FieldPath = firebase.firestore.FieldPath;

export type TransformCallback<T, U = T> = (data: QueryDocumentSnapshot<T, DocumentData>) => U

export type QueryOptionsConstrains = (QueryLimitConstraint | QueryOrderByConstraint | QueryStartAtConstraint)[]

export interface FetchFromCollectionOptions<T> {
    perPage?: number;
    startAfter?: string;
    disableSort?: boolean;
    orderBy?: keyof T;
    query?: [string | FieldPath, WhereFilterOp, unknown];
    transform?: TransformCallback<T>;
}

export interface QueryOptions<T> {
    page?: string;
    perPage?: number;
    startAfter?: null | DocumentSnapshot<T, DocumentData>;
}
