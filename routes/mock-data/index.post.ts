export default defineEventHandler(async (event) => {
    try {
        const { body } = await readBody(event)

        // TODO: check custom response from the client

        // TODO: Read the template information

        // TODO: Update existing document...or not!

        return $fetch('/mock-data/create', body)

    } catch (e) {

        return createError({
            message: 'An error occurred when saving the document',
            statusCode: 400
        })
    }

})
