import * as generators from '@ngneat/falso'
import { TemplatingOptions } from "../types/templating";

function replaceMatch(value: unknown): unknown {
    if (typeof value !== 'string') return value

    const regex = /\{\{([^}]+)\}\}/g;
    const match = regex.exec(value)

    if (match === null) return value

    const matchStr = match[1].trim()
    if (matchStr in generators) return generators[matchStr]()
}

function interpolateMockData(template: unknown) {
    if (Array.isArray(template)) return template.map((val) => replaceMatch(val))
    let copy = structuredClone(template as Record<string, unknown>)

    for (let key in copy) {
        // TODO: Support arrays
        if (Array.isArray(copy[key])) {
            copy[key] = (copy[key] as unknown[]).map((val) => replaceMatch(val))
        } else if (typeof copy[key] === 'object') {
            if ('templatingOptions' in copy) {
                const { repeat = 1, type, value } = copy.templatingOptions as TemplatingOptions

                if (type === 'array') {
                    return new Array(repeat).fill(null).map(() => replaceMatch(value))
                }
            } else {
                copy[key] = interpolateMockData(copy[key] as Record<string, unknown>)
            }

        } else {
            copy[key] = replaceMatch(copy[key])
        }
    }

    return copy;
}

export function generateMockData(template: Record<string, unknown>, index: number) {
    return interpolateMockData(template);
}
