import { AvailableMockData } from "../../types/availableMockData";

export default defineEventHandler(async (event) => {
    const { fetchFromCollection } = useDB(event);

    const [coordinates ] = await fetchFromCollection(AvailableMockData.EvpMap_coordinates)

    if (!coordinates) return createError({
        message: 'No data found in the database or error fetching the data',
        statusCode: 404,
    })

    return { coordinates }
})
