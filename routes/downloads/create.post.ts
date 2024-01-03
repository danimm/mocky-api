import { addDoc, collection, Timestamp } from "firebase/firestore";

import downloadsMockData from "../../mockData/downloads";
import { AvailableMockData } from "../../types/availableMockData";

export default defineEventHandler(async (event) => {
    const { db } = useDB();
    const { Downloads } = AvailableMockData

    try {
        for (const download of downloadsMockData) {
            await addDoc(collection(db, Downloads), {
                ...download,
                createdAt: Timestamp.now(),
            })
        }

        return { statusCode: 200 }

    } catch (error) {
        return createError({
            message: error.message,
            statusCode: 500,
        })
    }

})
