const NewsCrawler = require('news-crawler')
const SourceConfig = require('../../../config/news-source-config.json')

jest.setTimeout(120000)

describe('news-crawler', () => {
	it('library test', async () => {
		const articles = await NewsCrawler(SourceConfig.slice(0, 1), 1)
		console.log('printing articles', articles)
		expect(articles.length).toBeGreaterThan(0)
	})
})
