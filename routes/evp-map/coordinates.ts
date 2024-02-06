import { WhereFilterOp } from "@firebase/firestore";
import firebase from "firebase/compat";
import FieldPath = firebase.firestore.FieldPath;

import { AvailableMockData } from "../../types/availableMockData";

export default defineEventHandler(async (event) => {
    const { fetchFromCollection } = useDB(event);
    const { id, popUp} = getQuery(event)

    const queryPayload: [string | FieldPath, WhereFilterOp, unknown] =
        // Enable search for perimeter types
        popUp ? ['popup_option', '==', popUp] : ['id', '==', id]

    const [coordinates ] = await fetchFromCollection(AvailableMockData.EvpMap_coordinates, {
        query: queryPayload
    })

    if (!coordinates.length) {
        setResponseStatus(event, 404)
        return {
            // error key is required for the current implementation of the frontend
            error: 'No data found in the database or error fetching the data',
        }
    }

    return { ...coordinates[0] }
})
