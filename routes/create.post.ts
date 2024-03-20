import {AvailableMockData} from "../types/availableMockData";

export default defineEventHandler(async (event) => {
      const { addDocumentToCollection } = useDB(event);

        const body = await readBody(event)

        const { collection, password, payload } = body

        if (password !== process.env.ADMIN_PASSWORD) return createError({
            message: 'Unauthorized',
            statusCode: 401,
        })

        try {
            const { id } = await addDocumentToCollection(collection as AvailableMockData, payload)
            setResponseStatus(event, 200)
            return { message: `Successfully added document with id: ${id}` }
        } catch (e) {
            return createError({
                message: e.message,
                statusCode: 500,
            })
        }
})
