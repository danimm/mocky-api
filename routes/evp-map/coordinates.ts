import { AvailableMockData } from "../../types/availableMockData";

export default defineEventHandler(async (event) => {
    const { fetchFromCollection } = useDB(event);
    
    // TODO: Figure out how to use lat and lng
    const {
        id,
        lat ,
        lng
    } = getQuery(event)

    const [coordinates ] = await fetchFromCollection(AvailableMockData.EvpMap_coordinates, {
        // TODO: Remove hardcoded query
        query: ['id', '==', 'Wärmeverbund Wetzikon',]
    })

    if (!coordinates.length) return createError({
        message: 'No data found in the database or error fetching the data',
        statusCode: 404,
    })

    return { ...coordinates[0] }
})
