import {Paginator} from "../types/common/paginator";
import {FetchFromCollectionOptions} from "../types/common/queryOptions";

export function usePaginator<T>({ url, lastPositionId, options, totalCount }: {
    url: URL,
    lastPositionId: string,
    options: FetchFromCollectionOptions<T>,
    totalCount: number,
}): { paginator: Paginator } {
    const numPages = Math.ceil(totalCount / options.perPage)

    const loadMore = new URL(url)
    loadMore.searchParams.set('page', lastPositionId)

    return {
        paginator: {
            count: totalCount,
            num_pages: numPages,
            per_page: options.perPage,
            has_next: (options.perPage * 2) < totalCount,
            current_page: options.startAfter || '',
            load_more: loadMore,
            // TODO: remove hardcoded values
            translations: '{\\"load_more_label\\": \\"Mehr anzeigen\\", \\"progress_text\\": \\"{PROGRESS} von {COUNT} werden angezeigt.\\"}',
        }
    }
}
