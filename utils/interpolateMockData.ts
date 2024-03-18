import { TemplatingOptions, SwitchCase } from "../types/templating";
import { replaceMatch } from './replaceMatch'

export function interpolateMockData(template: unknown, index: number = 0): unknown {
    // Basic array
    if (Array.isArray(template)) return template.map((val) => replaceMatch(val, index))

    // Create a deep copy of the original object
    let copy: unknown  = structuredClone(template as Record<string, unknown>)

    const { templatingOptions = {} } = copy as { templatingOptions: TemplatingOptions }
    const {
        switchCase = null,
        oneOf = null,
        someOf = null,
        repeat = null,
        type = 'array',
        value
    } = templatingOptions

    // ** Switch case **
    if (switchCase as SwitchCase) {
        const { check, defaultCase, cases} = templatingOptions.switchCase

        if ([check, defaultCase, cases].some((val) => val === undefined)) {
            return copy
        }

        const match = replaceMatch(check, index)

        const foundMatch = cases.find((c) => {
            // Cast the match to a number if it's a string in order to compare it
            if (typeof c.match === 'string' && typeof match === 'number')
                return Number(c.match) === match
            else
                return c.match === match
        })

        const value  = foundMatch !== undefined ? replaceMatch(foundMatch.value, index) : replaceMatch(defaultCase, index)
        copy = repeat !== null ? new Array(repeat).fill(null).map(() => value) : value
        return copy
    }

    // ** Some of the provided inputs **
    if (someOf && someOf.length > 0) {
        // Generate an array with elements between 1 and length of someOf
        const randomLength = Math.floor(Math.random() * someOf.length) + 1

        copy = new Array(randomLength).fill(null).map(() => {
            const elementToGenerate = someOf[Math.floor(Math.random() * someOf.length)]
            return replaceMatch(elementToGenerate, index)
        })

        return copy
    }

    // ** One of the provided inputs **
    if (oneOf && oneOf.length > 0) {
        // Get a random index from the oneOf array
        const randomIndex = Math.floor(Math.random() * oneOf.length)

        // @ts-ignore
        replaceMatch(oneOf[randomIndex], index)
        copy = repeat !== null ? new Array(repeat).fill(null).map(() => replaceMatch(oneOf[randomIndex], index)) : replaceMatch(oneOf[randomIndex], index)
        return copy
    }

    // ** Iterate over the object and replace the values **
    for (let key in copy as Record<string, unknown>) {
        // Normal arrays
        if (Array.isArray(copy[key]) && someOf === null && oneOf === null) {
            copy[key] = (copy[key] as unknown[]).map((val: unknown) => replaceMatch(val, index))

        // Objects or template arrays
        } else if (typeof copy[key] === 'object') {

            // Normal Template Array
            if (repeat !== null) {
                // TODO: Support other kinds of types
                // Support Arrays and Objects for now
                if (type === 'array' && value !== undefined) {
                    return new Array(repeat)
                        .fill(null)
                        .map(() => typeof value === 'object' ? interpolateMockData(value, index) : replaceMatch(value, index))
                }

            // Normal object
            } else {
                copy[key] = interpolateMockData(copy[key] as Record<string, unknown>, index)
            }

        // Primitive values
        } else {
            copy[key] = replaceMatch(copy[key], index)
        }
    }

    return copy;
}
