export function interpolateQuery(str: string): string {
    const regex = /\{\{(.*?)\}\}/g;
    const matches = [];
    const match = regex.exec(str)[1] ?? str;
    // const result = match.trim();

    // // Iteramos sobre todas las coincidencias encontradas
    // while ((match = regex.exec(str)) !== null) {
    //     matches.push(match[1].trim());
    // }

    return match.trim();
}
