const SourceConfig = require('./source-config.json')

let Programs = []
SourceConfig.forEach((pub) => {
	pub.pages.forEach((pgm) => {
		pgm.id = pgm.programId
		pgm.title = pgm.program
		pgm.publisher = {
			id: pub.sourceId,
			title: pub.sourceName,
			imageUrl: process.env.SERVER_BASE_URL + pub.imageUrl,
		}
		Programs.push(pgm)
	})
})

module.exports = Programs
