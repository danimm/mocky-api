import { describe, expect } from "vitest";
import { generateMockData } from "../../utils/generateMockData";

describe("template engine: utils/generateMockData", (it) => {
    const createArray = (numberOfElements: number, content: unknown) => new Array(numberOfElements).fill(content)

    it("should interpolate the template with random mock data", () => {
        const options = { repeat: 1 }

        const template = {
            name: '{{randFirstName}}',
            age: '{{randNumber}}',
            address: {
                street: '{{randStreet}}',
                city: '{{randCity}}'
            }
        }

        const match = generateMockData(template, options)
        expect(match).not.toBe(template)
    })

    it("should create more than one template", () => {
        const repeat = 4
        const template = {
            name: '{{ This is a test }}',
        }

        const match = generateMockData(template, { repeat })

        expect(match.length).toBe(repeat)
        expect(match).toStrictEqual(createArray(repeat, template))
    })
})
