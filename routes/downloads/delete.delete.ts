import { AvailableMockData } from "../../types/availableMockData";
import {collection, deleteDoc, doc, documentId, getDocs, query, where} from "@firebase/firestore";

export default defineEventHandler(async (event) => {
    const { db } = useDB();
    const { Downloads } = AvailableMockData

    try {
        const q = query(collection(db, Downloads), where(documentId(), "!=", 'metadata'))
        const docs = await getDocs(q)
        for (const downloadDoc of docs.docs) {
            await deleteDoc(doc(db, Downloads, downloadDoc.id));
        }

        return { statusCode: 200 }

    } catch (error) {
        return createError({
            message: error.message,
            statusCode: 500,
        })
    }
})
