import { describe, expect } from "vitest";
import { interpolateMockData } from "../../utils/interpolateMockData";

describe("template engine: utils/interpolateMockData", (it) => {
    it("should interpolate the mock data", () => {
        const mockData = {
            name: '{{randFirstName}}',
            age: '{{randNumber}}',
            address: {
                street: '{{randStreet}}',
                city: '{{randCity}}'
            }
        }

        const match = interpolateMockData(mockData)
        expect(match).not.toBe(mockData)
    })

    it('should interpolate an array of mock data', () => {
        const mockData = {
            someOf: ['{{randFirstName}}', '{{randLastName}}']
        }

        const match = interpolateMockData(mockData)

        expect(match).not.toBe(mockData)
        expect(match).toBeTypeOf('object')
        expect(Array.isArray(match)).toBeTruthy()
    })
})
