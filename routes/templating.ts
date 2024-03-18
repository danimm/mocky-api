import { TemplatingRequest } from "../types/templating";
import { generateMockData } from "../utils/generateMockData";
import { interpolateMockData } from "../utils/interpolateMockData";

export default defineEventHandler(async (event) => {
    const { options, ...template} = await readBody<TemplatingRequest>(event)

    return options ? generateMockData(template, options) : interpolateMockData(template)
})
