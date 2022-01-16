const PodcastCrawler = require('../index')
const { dbConnection } = require('../../../helper/connectionHelper')
const SourceConfig = require('../../../config/source-config.json')

jest.setTimeout(120000)

beforeAll(async () => {
	await dbConnection()
})

describe('podcastCrawler', () => {
	it('integration test', async () => {
		const config = SourceConfig.filter((s) => s.sourceId === 'bbcmedia')
		await PodcastCrawler(config)
	})
})
