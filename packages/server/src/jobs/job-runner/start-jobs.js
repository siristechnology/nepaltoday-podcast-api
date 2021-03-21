require('dotenv').config()
const Agenda = require('agenda')
const logger = require('../../config/logger')

const crawler = require('../podcastCrawler/index')

module.exports = async function () {
	logger.info('starting jobs')

	const agenda = new Agenda({ db: { address: process.env.DATABASE_URL } })

	agenda.define('download podcasts', async (job) => {
		logger.info('download podcasts job started')
		crawler()
	})

	await agenda.start()

	await agenda.every('30 minutes', 'download podcasts')
}
