import { AvailableMockData } from "../../types/availableMockData";
import { useFirestore } from "../../utils/useFirestore";

export default defineEventHandler(async (event) => {
    const { id = '' } = getQuery<{ id: string }>(event)

    const { db } = useDB(event);
    const { getDocument, getDocData  } = useFirestore<Record<string, unknown>>(db, AvailableMockData.MockData)

    if (!id) {
        return createError({
            message: 'id parameter is required',
            statusCode: 404
        })
    }

    try {
        const snapshot = await getDocument(id)
        const body = snapshot.data()

        const { statusCode = null, response = null , ...data } = body

        if (statusCode) setResponseStatus(event, statusCode as number)

        return await $fetch('/templating', {
            method: 'POST',
            body: response ?? data
        })


    } catch (e) {
        return createError({
            message: 'No data was found',
            statusCode: 404
        })
    }
})
