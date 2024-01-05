import { AvailableMockData } from "../../types/availableMockData";

export default defineEventHandler(async (event) => {
  const { fetchFromCollection } = useDB(event);

    const { page = '' } = getQuery<{ page: string }>(event)

    const [data, metadata] = await fetchFromCollection(AvailableMockData.Downloads, {
        startAfter: page,
        perPage: 7,
    })

    if (!data) return createError({
        message: 'No data found in the database or error fetching the data',
        statusCode: 404,
    })


    return { data, metadata }
})
