import type { QueryOptions, QueryOptionsConstrains } from "../types/common/queryOptions";
import { limit, orderBy, startAt } from "@firebase/firestore";

export function useQueryPagination<T>(options: QueryOptions<T>): QueryOptionsConstrains {
    const queryOptions: QueryOptionsConstrains = [orderBy('created_at', 'desc')]
    if (options.limit) queryOptions.push(limit(options.limit))
    if (options.startAt) queryOptions.push(startAt(options.startAt))

    return queryOptions
}
