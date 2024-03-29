import { AvailableMockData } from "../../types/availableMockData";
import { useFirestore } from "../../utils/useFirestore";

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
        const { db } = useDB(event);
        const { deleteDocument } = useFirestore(db, AvailableMockData.MockData)
        const { id: documentId } = getQuery<{ id: string | undefined }>(event)

        if (!documentId) {
            return createError({
                message: 'Document id is required',
                statusCode: 400
            })
        }

        await deleteDocument(documentId)
        setResponseStatus(event, 200)

        // Clear the cache
        await storage.removeItem(documentId)

        return { message: `The document was successfully deleted: ${documentId}` }

    } catch (e) {
        return createError({
            message: e.message,
            statusCode: 500,
        })
    }
})
