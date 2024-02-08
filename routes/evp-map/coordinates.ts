import { AvailableMockData } from "../../types/availableMockData";

export default defineEventHandler(async (event) => {
    const { fetchFromCollection } = useDB(event);
    const { lat, lng} = getQuery(event)

    const [coordinates ] = await fetchFromCollection(AvailableMockData.EvpMap_coordinates, {
        query: ['lat', '==', lat]
    })

    if (!coordinates.length) {
        setResponseStatus(event, 404)
        return {
            // error key is required for the current implementation of the frontend
            error: 'No data found in the database or error fetching the data',
        }
    }

    return { ...coordinates[0] }
})
