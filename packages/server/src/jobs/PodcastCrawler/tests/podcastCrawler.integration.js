const PodcastCrawler = require('../index')
const { dbConnection } = require('../../../helper/connectionHelper')

jest.setTimeout(1200000)

beforeAll(async () => {
	await dbConnection()
})

describe('podcastCrawler', () => {
	it('integration test', async () => {
		await PodcastCrawler()
	})
})
