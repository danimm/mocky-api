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

    it('should interpolate an array of some of the provided inputs', () => {
        const mockData = {
            templatingOptions: {
                someOf: ['{{randFirstName}}', '{{randLastName}}']
            }
        }

        const match = interpolateMockData(mockData)
        expect(match).not.toBe(mockData)
        expect(Array.isArray(match)).toBeTruthy()

        const match2 = interpolateMockData({
            templatingOptions: { someOf: ['test', 'test'] }
        })
        expect(match2).toContain('test')
    })

    it('should interpolate one of some of the provided inputs', () => {
        const oneOf = ['Dani', 'Diego']
        const mockData = {
            templatingOptions: { oneOf }
        }

        const match = interpolateMockData(mockData)
        expect(oneOf.includes(match as string)).toBeTruthy()
    })

    it('it should combine the provided inputs as a several length array ', () => {
        const oneOf = ['Dani', 'Dani']
        const mockData = {
            templatingOptions: {
                oneOf,
                repeat: 3
            }
        }

        const match = interpolateMockData(mockData)
        expect(match).toContain(oneOf[0])
        expect(match).toHaveLength(3)
    })
})
