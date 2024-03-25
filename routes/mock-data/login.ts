import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";

export default defineEventHandler(async (event) => {
    try {
        const { email, password } = await readBody(event)

        if (!email || !password) {
            return createError({
                message: "Email and password are required",
                statusCode: 400,
            })
        }

        const auth = getAuth()
        const { user } = await signInWithEmailAndPassword(auth, email, password)

        setCookie(event, "uid", user.uid, {
            // 2 weeks
            maxAge: 60 * 60 * 24 * 14,
        })

        return { user }

    } catch (e) {
        return createError({
            message: e.message,
            statusCode: 401,
        })
    }
})
