import { AvailableMockData } from "../../types/availableMockData";
import { useFirestore } from "../../utils/useFirestore";

export default defineEventHandler(async (event) => {
    const { id = '' } = getQuery<{ id: string }>(event)

    const { db } = useDB(event);
    const { getDocument, getDocData  } = useFirestore(db, AvailableMockData.MockData)

    if (!id) {
        return createError({
            message: 'id parameter is required',
            statusCode: 404
        })
    }

    try {
        const snapshot = await getDocument(id)
        const body = snapshot.data()

        return await $fetch('/templating', { method: 'POST', body })


    } catch (e) {
        return createError({
            message: 'No data was found',
            statusCode: 404
        })
    }
})
