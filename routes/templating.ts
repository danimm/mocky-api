import { TemplatingRequest } from "../types/templating";

export default defineEventHandler(async (event) => {
    const { options, template} = await readBody<TemplatingRequest>(event)

    return generateMockData(template, options)
})
