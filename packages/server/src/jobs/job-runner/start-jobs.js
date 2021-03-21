require('dotenv').config()
const Agenda = require('agenda')
const logger = require('../../config/logger')

const crawler = require('../NewsCrawlerTrigger/index')
const newsChecker = require('../newsChecker')

module.exports = async function () {
	logger.info('starting jobs')

	const agenda = new Agenda({ db: { address: process.env.DATABASE_URL } })

	agenda.define('crawl articles', async (job) => {
		logger.info('crawl articles job started')
		crawler()
	})

	agenda.define('check news from sources', async (job) => {
		logger.info('checking news job started')
		newsChecker()
	})

	await agenda.start()

	await agenda.every('30 minutes', 'crawl articles')
	await agenda.every('24 hours', 'check news from sources')
}
