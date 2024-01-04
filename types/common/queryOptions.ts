import {
    DocumentData,
    DocumentSnapshot,
    QueryLimitConstraint,
    QueryOrderByConstraint, QuerySnapshot,
    QueryStartAtConstraint
} from "@firebase/firestore";

export type QueryOptionsConstrains = (QueryLimitConstraint | QueryOrderByConstraint | QueryStartAtConstraint)[]

export interface QueryOptions<T> {
    page?: string;
    perPage?: number;
    startAt?: string;
    transform?: (data: T[]) => T[];
}
