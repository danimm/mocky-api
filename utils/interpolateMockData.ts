import { TemplatingOptions, SwitchCase } from "../types/templating";
import { replaceMatch } from './replaceMatch'

export function interpolateMockData(template: unknown, index: number = 0): unknown {
    // Basic array
    if (Array.isArray(template)) return template.map((val) => replaceMatch(val, index))

    // Create a deep copy of the original object
    let copy: unknown | Record<string, unknown>  = structuredClone(template as Record<string, unknown>)

    const { templatingOptions = {} } = copy as { templatingOptions: TemplatingOptions }
    const {
        switchCase = null,
        oneOf = null,
        someOf = null,
        repeat = null,
        type = null,
    } = templatingOptions

    if (switchCase as SwitchCase) {
        const { check, defaultCase, cases} = templatingOptions.switchCase

        if ([check, defaultCase, cases].some((val) => val === undefined)) {
            return copy
        }

        const match = replaceMatch(check, index)

        const foundMatch = cases.find((c) => {
            if (typeof c.match === 'string' && typeof match === 'number')
                return Number(c.match) === match
            else
                return c.match === match
        })

        const value  = foundMatch !== undefined ? replaceMatch(foundMatch.value, index) : replaceMatch(defaultCase, index)
        copy = repeat !== null ? new Array(repeat).fill(null).map(() => value) : value
        return copy
    }

    // TODO: Improve the typing and avoid repeating the same code
    if (someOf && someOf.length > 0) {
        // Generate an array with elements between 1 and length of someOf
        const randomLength = Math.floor(Math.random() * someOf.length) + 1

        // @ts-ignore
        copy = new Array(randomLength).fill(null).map(() => {
            const elementToGenerate = someOf[Math.floor(Math.random() * someOf.length)]
            return replaceMatch(elementToGenerate, index)
        })

        return copy
    }

    if (oneOf && oneOf.length > 0) {
        // Get a random index from the oneOf array
        const randomIndex = Math.floor(Math.random() * oneOf.length)

        // @ts-ignore
        replaceMatch(oneOf[randomIndex], index)
        copy = repeat !== null ? new Array(repeat).fill(null).map(() => replaceMatch(oneOf[randomIndex], index)) : replaceMatch(oneOf[randomIndex], index)
        return copy
    }

    // Iterate over the object and replace the values
    // @ts-ignore
    for (let key in copy) {
        // Normal arrays
        // @ts-ignore
        if (Array.isArray(copy[key]) && !('someOf' in copy) && !('oneOf' in copy)) {
            copy[key] = (copy[key] as unknown[]).map((val) => replaceMatch(val, index))

            // Objects or template arrays
        } else if (typeof copy[key] === 'object') {

            // Normal Template Array
            // @ts-ignore
            if ('templatingArray' in copy) {
                const {
                    repeat = 1,
                    type = 'array',
                    value,
                } = copy.templatingArray as TemplatingOptions

                // Support Arrays and Objects for now
                if (type === 'array') {
                    return new Array(repeat)
                        .fill(null)
                        .map(() => typeof value === 'object' ? interpolateMockData(value, index) : replaceMatch(value, index))
                }

            }
            // Normal object
            else {
                copy[key] = interpolateMockData(copy[key] as Record<string, unknown>, index)
            }

            // Primitive values
        } else {
            copy[key] = replaceMatch(copy[key], index)
        }
    }

    return copy;
}
