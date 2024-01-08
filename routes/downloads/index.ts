import { H3Error } from "h3";
import { AvailableMockData } from "../../types/availableMockData";
import { DownloadResponse } from "../../types/download";

export default defineEventHandler(async (event): Promise<DownloadResponse | H3Error> => {
  const { fetchFromCollection } = useDB(event);

    const { page = '', limit = 15 } = getQuery(event)

    const [downloads, metadata] = await fetchFromCollection(AvailableMockData.Downloads, {
        startAfter: page as string,
        perPage: Number(limit),
    })

    if (!downloads) return createError({
        message: 'No data found in the database or error fetching the data',
        statusCode: 404,
    })

    return { downloads, ...metadata }
})
