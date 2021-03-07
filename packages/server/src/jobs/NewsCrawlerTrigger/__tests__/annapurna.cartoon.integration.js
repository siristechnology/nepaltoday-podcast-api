const NewsCrawler = require('news-crawler')
const SourceConfig = require('../../../config/news-source-config.json')

jest.setTimeout(120000)

describe('news-crawler', () => {
	it('Annapurna Cartoon can be scraped', async () => {
		const source = SourceConfig.filter((s) => s.name === 'Annapurna Post' && s.pages.some((p) => p.category === 'cartoon'))

		const articles = await NewsCrawler(source, 2)

		expect(articles.length).toBeGreaterThan(1)
	})
})
