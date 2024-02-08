import { AvailableMockData } from "../../types/availableMockData";

export default defineEventHandler(async (event) => {
    const { addDocumentToCollection } = useDB(event);

    const body = await readBody(event)

    try {
        const { id } = await addDocumentToCollection(AvailableMockData.EvpMap_coordinates, body)
        setResponseStatus(event, 200)
        return { message: `Successfully added document with id: ${id}` }
    } catch (e) {
        return createError({
            message: e.message,
            statusCode: 500,
        })
    }
})
