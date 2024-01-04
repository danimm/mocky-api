import { DownloadDoc, DownloadMetadata } from "../../types/download";
import { AvailableMockData } from "../../types/availableMockData";

export default defineCachedEventHandler(async (event) => {
  const { fetchFromCollection } = useDB();

    const [
        data,
        metadata
    ] = await fetchFromCollection<DownloadDoc, DownloadMetadata>(AvailableMockData.Downloads)


    if (!data) return createError({
        message: 'No data found in the database or error fetching the data',
        statusCode: 404,
    })

    // TODO: Pagination
    return { data, metadata }
}, { swr: false })
