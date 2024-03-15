import { generateMockData } from "../../utils/generateMockData";

describe("template engine: utils/generateMockData", (it) => {
    const createArray = (numberOfElements: number, content: unknown) => new Array(numberOfElements).fill(content)

    it("should interpolate the template with random mock data", () => {
        const options = { repeat: 1 }

        const template = {
            name: 'Muster',
            lastName: '{{randLasstName}}',
            age: 20,
            address: {
                street: '{{randStreet}}',
                number: 10,
                city: '{{randCity}}'
            }
        }

        const match = generateMockData(template, options)
        expect(match).not.toBe(template)
        expect(match[0]).toHaveProperty('name', 'Muster')
        expect(match[0]).toHaveProperty('address.street')
        expect(match[0]).toHaveProperty('address.city')
        expect(match[0]).toHaveProperty('address.number', 10)
    })

    it("it should not contain any config keys", () => {
        type Hobbies = { hobbies: string[] }
        const repeat = 2
        const hobbies = {
            templatingArray: {
                repeat,
                value: 'gaming'
            }
        }

        const match = generateMockData({ hobbies }, { repeat })

        expect(match[0]).toHaveProperty('hobbies')
        expect(match[0]).not.toHaveProperty('templatingArray')
        expect((match[0] as Hobbies).hobbies).toHaveLength(repeat)
    })

    it("should create more than one template", () => {
        const repeat = 4
        const template = {
            name: '{{ This is a test }}',
        }

        const match = generateMockData(template, { repeat })

        expect(match).toHaveLength(repeat)
        expect(match).toStrictEqual(createArray(repeat, template))
    })

    it('should interpolate a switch case', () => {
        const mockData = {
            checkSwitchCase: {
                templatingOptions: {
                    switchCase: {
                        check: '{{@index}}',
                        defaultCase: 'Jack',
                        cases: [
                            { match: '0', value: 'Andre' },
                            { match: '1', value: 'Dani' },
                            { match: '2', value: 'Diego' },
                        ]
                    }
                }
            }
        }

        const match = generateMockData(mockData, { repeat: 1 })

        expect(match[0]).toHaveProperty('checkSwitchCase', 'Andre')
    })
})
