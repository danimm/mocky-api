import * as generators from '@ngneat/falso'
import { TemplatingOptions } from "../types/templating";

function replaceMatch(value: unknown, index: number): unknown {
    if (typeof value !== 'string') return value

    const regex = /\{\{([^}]+)\}\}/g;
    const match = regex.exec(value)

    if (match === null) return value

    const matchStr = match[1].trim()
    if (matchStr === '@index') return index
    else if (matchStr in generators) return generators[matchStr]()
}

function interpolateMockData(template: unknown, index: number): unknown {
    if (Array.isArray(template)) return template.map((val) => replaceMatch(val, index))
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
