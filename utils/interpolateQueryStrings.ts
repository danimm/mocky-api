import { TemplatingOptions } from "../types/templating";

function interpolateMockData(template: unknown, index: number): unknown {
    // Basic array
    if (Array.isArray(template)) return template.map((val) => replaceMatch(val, index))

    // Create a deep copy of the original object
    let copy = structuredClone(template as Record<string, unknown>)

    // TODO: Improve the typing and avoid repeating the same code
    if ('someOf' in copy) {
        const { someOf = []  } = copy as TemplatingOptions
        // Generate an array with elements between 1 and length of someOf
        const randomLength = Math.floor(Math.random() * someOf.length) + 1

        // @ts-ignore
        copy = new Array(randomLength).fill(null).map(() => {
            const elementToGenerate = someOf[Math.floor(Math.random() * someOf.length)]
            return replaceMatch(elementToGenerate, index)
        })

        return copy
    } else if ('oneOf' in copy) {
        const { oneOf = []  } = copy as TemplatingOptions
        // Get a random index from the oneOf array
        const randomIndex = Math.floor(Math.random() * oneOf.length)

        // @ts-ignore
        copy = replaceMatch(oneOf[randomIndex], index)
        return copy
    }

    // Iterate over the object and replace the values
    for (let key in copy) {
        // Normal arrays
        if (Array.isArray(copy[key]) && !('someOf' in copy) && !('oneOf' in copy)) {
            copy[key] = (copy[key] as unknown[]).map((val) => replaceMatch(val, index))

            // Objects or template arrays
        } else if (typeof copy[key] === 'object') {

            // Normal Template Array
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

export function generateMockData(template: Record<string, unknown>, index: number) {
    return interpolateMockData(template, index);
}
