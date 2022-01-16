const sortArrayByWeight = (arr = []) => {
	return arr.sort((a, b) => (a.weight > b.weight ? -1 : b.weight > a.weight ? 1 : 0))
}

const removeForwardSlashAndWhiteSpaces = (value) => {
	let valueToReturn = ''
	if (value.includes('/')) {
		valueToReturn = value.replace('/', '').trim()
	} else {
		valueToReturn = value.trim()
	}
	return valueToReturn
}

module.exports = {
	sortArrayByWeight,
	removeForwardSlashAndWhiteSpaces,
}
