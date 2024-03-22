import { getAuth, signOut } from "@firebase/auth";

export default defineEventHandler(async (event) => {
    const auth = getAuth()
    await signOut(auth)

    return { message: "Logged out successfully" }
})
