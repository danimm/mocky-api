import * as generators from "@ngneat/falso";

export function replaceMatch(value: unknown, index: number): unknown {
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
