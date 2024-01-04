import type { QueryOptions, QueryOptionsConstrains } from "../types/common/queryOptions";
import {documentId, limit, orderBy, startAt} from "@firebase/firestore";

export function useQueryPagination<T>(options: QueryOptions<T>): QueryOptionsConstrains {
    const queryOptions: QueryOptionsConstrains = [orderBy('created_at', 'desc')]
    // const queryOptions: QueryOptionsConstrains = [orderBy(documentId())]
    if (options.perPage) queryOptions.push(limit(options.perPage))
    if (options.startAt) queryOptions.push(startAt(options.startAt))

    return queryOptions
}
