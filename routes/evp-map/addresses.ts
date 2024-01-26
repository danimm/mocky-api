import { AvailableMockData } from "../../types/availableMockData";

export default defineEventHandler(async (event) => {
    const { fetchFromCollection } = useDB(event);

    const [addresses] = await fetchFromCollection(AvailableMockData.EvpMap_search_addresses)

    if (!addresses) return createError({
        message: 'No data found in the database or error fetching the data',
        statusCode: 404,
    })

    return { addresses, total: addresses.length }
})
