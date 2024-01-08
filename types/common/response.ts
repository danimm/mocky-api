import {
    AggregateField,
    AggregateQuerySnapshot,
    DocumentData,
    DocumentSnapshot,
    QuerySnapshot
} from "@firebase/firestore";

export type DataResponse<R, M> = [PromiseFulfilledResult<QuerySnapshot<R, DocumentData>>, PromiseFulfilledResult<DocumentSnapshot<M, DocumentData>>, PromiseFulfilledResult<AggregateQuerySnapshot<{count: AggregateField<number>}, R, DocumentData>>]
