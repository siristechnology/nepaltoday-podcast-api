const NewsCrawler = require('news-crawler')
const SourceConfig = require('../../../config/source-config.json')

jest.setTimeout(120000)

describe('news-crawler', () => {
	it('library test', async () => {
		const articles = await NewsCrawler(SourceConfig.slice(0, 1), 2)
		expect(articles.length).toBeGreaterThan(0)
	})
})
