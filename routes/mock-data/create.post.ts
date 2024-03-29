import { AvailableMockData } from "../../types/availableMockData";

export default defineEventHandler(async (event) => {

    const { password} = getQuery(event)
    const storage = useStorage('mocks')

    // TODO: For now this endpoint will work just in the local environment, prod env variable is not set
    if (password !== process.env.ADMIN_PASSWORD) {
        throw createError({
            message: 'Please enter the admin password to be able to enter data into the db',
            statusCode: 401
        })
    }

    // TODO: Discover how to send cookies in Hoppscotch
    // if (!getCookie(event, 'uid')) {
    //     throw createError({
    //         message: 'please log in with your admin account to be able to enter data into the db',
    //         statusCode: 401
    //     })
    // }

    try {
        const { addDocumentToCollection } = useDB(event);
        const body = await readBody(event)

        const { id: documentId } = await addDocumentToCollection(AvailableMockData.MockData, body)
        setResponseStatus(event, 200)

        // Cache the data
        await storage.setItem(documentId, body)

        return { message: `Successfully added document with id: ${documentId}` }

    } catch (e) {

        return createError({
            message: e.message,
            statusCode: 500,
        })

    }
})
