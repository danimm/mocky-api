import { DownloadDoc, DownloadMetadata } from "../../types/download";
import { AvailableMockData } from "../../types/availableMockData";

export default defineCachedEventHandler(async (event) => {
  const { fetchFromCollection } = useDB();

    const { page = '' } = getQuery<{ page: string }>(event)

    console.log({ page })

    const [
        data,
        metadata
    ] = await fetchFromCollection<DownloadDoc, DownloadMetadata>(
        AvailableMockData.Downloads,
        { startAt: page, perPage: 2 }
    )

    if (!data) return createError({
        message: 'No data found in the database or error fetching the data',
        statusCode: 404,
    })

    // TODO: Update return format based on the current API
    return { data, metadata }
}, { swr: false })
