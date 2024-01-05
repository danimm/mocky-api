import { DownloadDoc, DownloadMetadata } from "../../types/download";
import { AvailableMockData } from "../../types/availableMockData";

export default defineCachedEventHandler(async (event) => {
  const { fetchFromCollection } = useDB();
  const { Downloads } = AvailableMockData

    const { page = '' } = getQuery<{ page: string }>(event)

    const [data, metadata] =
        await fetchFromCollection<DownloadDoc, DownloadMetadata>(Downloads, {
            startAfter: page, perPage: 7
        })

    if (!data) return createError({
        message: 'No data found in the database or error fetching the data',
        statusCode: 404,
    })

    // TODO: Update return format based on the current API
    return { data, metadata }
}, { swr: false })
