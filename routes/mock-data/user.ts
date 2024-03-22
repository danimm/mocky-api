import {getAuth} from "@firebase/auth";

export default defineEventHandler(async (event) => {
    const auth = getAuth()

    return auth.currentUser ?? createError({
        statusCode: 404
    })
})
