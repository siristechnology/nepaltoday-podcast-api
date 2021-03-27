const SourceConfig = require('./source-config.json')

let Programs = []
SourceConfig.forEach((pub) => {
	pub.pages.forEach((pgm) => {
		pgm.id = pgm.programId
		pgm.title = pgm.program
		Programs.push(pgm)
	})
})

module.exports = Programs
