require('dotenv').config()
const Agenda = require('agenda')
const logger = require('../../config/logger')

const crawler = require('../podcastCrawler/index')
const newsChecker = require('../newsChecker')

module.exports = async function () {
	logger.info('starting jobs')

	const agenda = new Agenda({ db: { address: process.env.DATABASE_URL } })

	agenda.define('download podcasts', async (job) => {
		logger.info('download podcasts job started')
		crawler()
	})

	agenda.define('check podcasts from sources', async (job) => {
		logger.info('checking podcasts job started')
		newsChecker()
	})

	await agenda.start()

	await agenda.every('30 minutes', 'download podcasts')
	await agenda.every('24 hours', 'check podcasts from sources')
}
