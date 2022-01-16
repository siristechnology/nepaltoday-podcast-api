const { sortArrayByWeight, removeForwardSlashAndWhiteSpaces } = require('./arrayUtil')

describe('Array Util Test', () => {
	it('sort array by weight', () => {
		const arr = [
			{ source: 'Kantipur', weight: 50 },
			{ source: 'Ratopati', weight: 60 },
			{ source: 'Setopati', weight: 70 },
			{ source: 'Hariyopati', weight: 70 },
		]
		const expected = [
			{ source: 'Setopati', weight: 70 },
			{ source: 'Hariyopati', weight: 70 },
			{ source: 'Ratopati', weight: 60 },
			{ source: 'Kantipur', weight: 50 },
		]

		const sortedArr = sortArrayByWeight(arr)
		expect(JSON.stringify(sortedArr)).toBe(JSON.stringify(expected))
	})

	it('removeForwardSlashAndWhiteSpaces should remove forward slash if exists and trim', () => {
		const value = 'Hello /'
		const expected = removeForwardSlashAndWhiteSpaces(value)

		expect(expected).not.toBe(null)
		// the matches any whitespaces in the string value
		expect(expected).not.toMatch(/\s+/g)
		expect(expected).toBe('Hello')
	})
})
