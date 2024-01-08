import { collection, Timestamp } from "firebase/firestore";

import downloadsMockData from "../../mockData/downloads";
import { AvailableMockData } from "../../types/availableMockData";
import {doc, writeBatch } from "@firebase/firestore";

export default defineEventHandler(async (event) => {
    const { db } = useDB();
    const { Downloads } = AvailableMockData

    try {
        const batch = writeBatch(db)

        for (const download of downloadsMockData) {
            await new Promise((resolve) => {
                // We add a delay to simulate a real database
                setTimeout(() => {
                    batch.set(doc(collection(db, Downloads)), { ...download, 'created_at': Timestamp.now() })
                    resolve('')
                }, 1000)
            })
        }

        await batch.commit()

        return { statusCode: 200 }

    } catch (error) {
        return createError({
            message: error.message,
            statusCode: 500,
        })
    }

})
