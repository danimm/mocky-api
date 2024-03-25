import { AvailableMockData } from "../../types/availableMockData";
import { useFirestore } from "../../utils/useFirestore";

export default defineEventHandler(async (event) => {
    if (!getCookie(event, 'uid')) {
        throw createError({
            message: 'please log in with your admin account to be able to enter data into the db',
            statusCode: 401
        })
    }

    try {
        const { db } = useDB(event);
        const { updateDocument } = useFirestore(db, AvailableMockData.MockData)
        const body = await readBody(event)
        const { id: documentId } = getQuery<{ id: string | undefined }>(event)

        if (!documentId) {
            return createError({
                message: 'Document id is required',
                statusCode: 400
            })
        }

        await updateDocument(documentId, body)
        setResponseStatus(event, 200)

        return { message: `The document was successfully updated: ${documentId}` }

    } catch (e) {

        return createError({
            message: e.message,
            statusCode: 500,
        })

    }
})
