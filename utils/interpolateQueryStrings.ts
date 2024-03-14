import * as generators from '@ngneat/falso'
import { TemplatingOptions } from "../types/templating";

function replaceMatch(value: unknown, index: number): unknown {
    if (typeof value !== 'string') return value

    // Matches all the {{}} queries, could be more than one
    const regex = /\{\{([^}]+)\}\}/g;
    const matches: Set<string> = new Set();

    Array.from(value.matchAll(regex), match => {
        matches.add(match[1].trim());
    });

    // We need to update the value with the matches
    let result = value;

    // Iterate over all the matches, in case there are more than one
    for (const match of matches) {
        if (match === '@index') return index
        else if (match in generators) {
            const regexMatch = new RegExp(`\\{\\{\\s*(${match})\\s*\\}\\}`, 'g')
            result = result.replaceAll(regexMatch, generators[match]());
        }
    }

    return result
}

function interpolateMockData(template: unknown, index: number): unknown {
    // Basic array
    if (Array.isArray(template)) return template.map((val) => replaceMatch(val, index))
    // Create a deep copy of the original object
    let copy = structuredClone(template as Record<string, unknown>)

    for (let key in copy) {
        if (Array.isArray(copy[key]))
            copy[key] = (copy[key] as unknown[]).map((val) => replaceMatch(val, index))

        else if (typeof copy[key] === 'object') {

            // Arrays
            if ('templatingArray' in copy) {
                const {
                    repeat = 1,
                    type = 'array',
                    value
                } = copy.templatingArray as TemplatingOptions

                if (type === 'array') {
                    return new Array(repeat).fill(null).map(() => {
                        return typeof value === 'object' ? interpolateMockData(value, index) : replaceMatch(value, index)
                    })
                }

            } else {
                copy[key] = interpolateMockData(copy[key] as Record<string, unknown>, index)
            }

        } else {
            copy[key] = replaceMatch(copy[key], index)
        }
    }

    return copy;
}

export function generateMockData(template: Record<string, unknown>, index: number) {
    return interpolateMockData(template, index);
}
