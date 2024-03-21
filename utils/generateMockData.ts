import { TemplatingOptions } from "../types/templating";
import { interpolateMockData } from './interpolateMockData'

export function generateMockData(template: Record<string, unknown>, options: TemplatingOptions) {
    const { repeat = 1 } = options;

    return new Array(repeat)
        .fill(null)
        .map((_, index) => interpolateMockData(template, index))
}
