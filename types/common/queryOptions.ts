import {
    DocumentData,
    DocumentSnapshot,
    QueryLimitConstraint,
    QueryOrderByConstraint, QuerySnapshot,
    QueryStartAtConstraint
} from "@firebase/firestore";

export type QueryOptionsConstrains = (QueryLimitConstraint | QueryOrderByConstraint | QueryStartAtConstraint)[]

export interface QueryOptions<T> {
    page?: number;
    perPage?: number;
    startAt?: DocumentSnapshot<DocumentData> | QuerySnapshot<DocumentData>;
    limit?: number;
    transform?: (data: T[]) => T[];
}
