import { AvailableMockData } from "../../types/availableMockData";
import {collection, documentId, getDocs, query, where, writeBatch} from "@firebase/firestore";

export default defineEventHandler(async (event) => {
    const { db } = useDB();
    const { Downloads } = AvailableMockData

    try {
        const q = query(collection(db, Downloads), where(documentId(), "!=", 'metadata'))
        const docs = await getDocs(q)
        const batch = writeBatch(db)

        docs.docs.forEach((downloadDoc) => batch.delete(downloadDoc.ref))

        await batch.commit()

        return { statusCode: 200 }

    } catch (error) {
        return createError({
            message: error.message,
            statusCode: 500,
        })
    }
})
