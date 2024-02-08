import { AvailableMockData } from "../../types/availableMockData";

export default defineEventHandler(async (event) => {
    const { fetchFromCollection } = useDB(event);

    const [addresses] = await fetchFromCollection(AvailableMockData.EvpMap_search_addresses)

    if (!addresses) {
        setResponseStatus(event, 404)
        return {
            // error key is required for the current implementation of the frontend
            error: 'No data found in the database or error fetching the data',
        }
    }

    return { addresses, total: addresses.length }
})
