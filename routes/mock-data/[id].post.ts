export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { avoidRequest = null } = <{ avoidRequest?: string }>getQuery(event)
    const id = getRouterParam(event, 'id')

    if (!avoidRequest) return await $fetch(`/mock-data/${id}`)

    // Avoid to fetch the data
    const { statusCode = null, response = null } = body

    if (response && Object.keys(response).length === 0) {
        return createError({
            message: 'You need to provide a correct structure: response object is missing',
            statusCode: 400
        })
    }

    if (statusCode) setResponseStatus(event, statusCode)

    try {
        return await $fetch('/templating', {
            method: 'POST',
            body: response ?? body
        })
    } catch (e) {
        return createError({
            message: e.message,
            statusCode: 500
        })
    }
})
