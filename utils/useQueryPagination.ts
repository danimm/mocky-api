import type { QueryOptions, QueryOptionsConstrains } from "../types/common/queryOptions";
import {documentId, limit, orderBy, startAfter, startAt} from "@firebase/firestore";

export function useQueryPagination<T>(options: QueryOptions<T>): QueryOptionsConstrains {
    const queryOptions: QueryOptionsConstrains = [orderBy('created_at', 'desc')]
    if (options.perPage) queryOptions.push(limit(options.perPage))
    if (options.startAfter) queryOptions.push(startAfter(options.startAfter))

    return queryOptions
}
