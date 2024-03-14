import * as generators from '@ngneat/falso'

function replaceMatch(value: unknown): unknown {
    if (typeof value !== 'string') return value

    const regex = /\{\{([^}]+)\}\}/g;
    const match = regex.exec(value)

    if (match === null) return value

    const matchStr = match[1].trim()
    console.log('matchStr: ', matchStr)
    if (matchStr in generators) return generators[matchStr]()
}

function interpolateQueryStrings(query: Record<string, unknown>) {
    const copy = structuredClone(query)

    for (let key in copy) {
        // TODO: Support arrays
        if (typeof copy[key] === 'object')
            copy[key] = interpolateQueryStrings(copy[key] as Record<string, unknown>)
        else
            copy[key] = replaceMatch(copy[key])
    }

    return copy;
}

export function generateMockData(query: Record<string, unknown>, index: number) {
    return interpolateQueryStrings(query);
}
