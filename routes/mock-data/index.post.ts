export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { id, avoidRequest } = <{ id: string, avoidRequest?: string }>getQuery(event)

        if (!id) {
            return createError({
                message: 'You need to provide an id',
                statusCode: 400
            })
        }

        // Avoid to fetch the data
        if (avoidRequest === 'true') {
            const { statusCode = null, response = {} } = body

            if (Object.keys(response).length === 0) {
                return createError({
                    message: 'You need to provide a correct structure: response object is missing',
                    statusCode: 400
                })
            }

            if (statusCode) setResponseStatus(event, statusCode)

            return await $fetch('/templating', {
                method: 'POST',
                body: response
            })
        }

        // Fetch the data from the DB
        const data = await $fetch('/mock-data', { query: { id } })

        const { statusCode = null, response = {} } = data

        if (Object.keys(response).length === 0) {
            return createError({
                message: 'You need to provide a correct structure: response object is missing',
                statusCode: 400
            })
        }

        if (statusCode) setResponseStatus(event, statusCode)

        return await $fetch('/templating', {
            method: 'POST',
            body: response
        })


    } catch (e) {

        return createError({
            message: 'Bad request',
            statusCode: 400
        })
    }

})
