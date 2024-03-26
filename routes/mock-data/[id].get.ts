import { AvailableMockData } from "../../types/availableMockData";
import { useFirestore } from "../../utils/useFirestore";

export default defineEventHandler(async (event) => {
    const docId = getRouterParam(event, 'id')

    const storage = useStorage('mocks')
    const hasCachedValues = await storage.hasItem('docId')

    if (hasCachedValues) {
        return await storage.getItem('docId')
    }

    const { db } = useDB(event);
    const { getDocument } = useFirestore<Record<string, unknown>>(db, AvailableMockData.MockData)

    // We want to handle the body separately just in case the document is not found or has no data
    let body: Record<string, unknown> = {}

    try {
        const snapshot = await getDocument(docId)
        body = snapshot.data()
    } catch (e) {
        console.error(e, 'error!!')
        return createError({
            message: 'No data was found',
            statusCode: 404
        })
    }

    const { statusCode = null, response = null } = body

    const data: Record<string, unknown> = await $fetch('/templating', {
        method: 'POST',
        body: response ?? body
    })

    // Set the status code if it was provided in the mock data
    if (typeof statusCode === 'number') setResponseStatus(event, statusCode, String(data.message) || '')

    // Cache the data
    await storage.setItem('docId', data)

    return data
})
