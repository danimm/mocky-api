import { replaceMatch } from "../../utils/replaceMatch";

describe("template engine: utils/replaceMatch", (it) => {
    it("should replace the match with a random number", () => {
        const match = replaceMatch('{{randNumber}}', 0)
        expect(Number(match)).toBeTypeOf('number')
    })

    it("should not replace the match of a invalid random number input", () => {
        const match2 = replaceMatch('{{randNumber1234}}', 0)
        expect(Number(match2)).toBeNaN()
    })

    it("should replace the match with a random first name", () => {
        const str = '{{randFirstName}}'
        const match = replaceMatch(str)
        expect(match).not.toMatch(str)

        const str2 = '{{ randFirstName }}'
        const match2 = replaceMatch(str2)
        expect(match2).not.toMatch(str2)
    })

    it("should not replace the match", () => {
        const str = '{{thisIsNotValid}}'
        const match = replaceMatch(str)
        expect(match).toBe(str)
    })

    it("should replace all the existing matches", () => {
        const str = '{{randFirstName}}, {{randLastName}}'
        const match = replaceMatch(str)
        // to not include any of: {{}} || {{ }}
        expect(match).not.match(/\{\{([^}]+)\}\}/g)
    })

    it("should not replace all the existing matches", () => {
        const str = '{{Energie360}}, {{randNumber}}'
        const match = replaceMatch(str)
        expect(match).toMatch('{{Energie360}}')
    })
})
