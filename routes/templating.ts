import { TemplatingRequest } from "../types/templating";
import {generateMockData} from "../utils/interpolateQueryStrings";

export default defineEventHandler(async (event) => {
    const {
        templatingOptions = {},
        query
    } = await readBody<TemplatingRequest>(event)

    return new Array(templatingOptions.repeat || 1)
        .fill(null)
        .map((_, index) => generateMockData(query, index))
})