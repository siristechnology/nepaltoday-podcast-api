const PodcastCrawler = require('news-crawler')
const SourceConfig = require('../../../config/source-config.json')

jest.setTimeout(40000)

describe('podcast-crawler', () => {
	it('ToughTalk with Dil Bhusan podcast can be scraped', async () => {
		const source = SourceConfig.filter((s) => s.sourceId === 'dilbhusan')

		const podcasts = await PodcastCrawler(source, { headless: true, articleUrlLength: 3 })

		expect(podcasts.length).toBeGreaterThan(0)
	})

	it('MiliJuli Nepali podcast can be scraped', async () => {
		const source = SourceConfig.filter((s) => s.sourceId === 'bbcmedia' && s.pages.some((p) => p.programId === 'MiliJuliNepali'))[0]
		source.pages = source.pages.filter((p) => p.programId === 'MiliJuliNepali')

		const podcasts = await PodcastCrawler([source], { headless: true, articleUrlLength: 3 })

		expect(podcasts.length).toBeGreaterThan(0)
	})

	it('Nepali Bahas podcast can be scraped', async () => {
		const source = SourceConfig.filter((s) => s.sourceId === 'NepaliRadioNetwork')

		const podcasts = await PodcastCrawler(source, { headless: true, articleUrlLength: 3 })

		expect(podcasts.length).toBeGreaterThan(0)
	})

	it('Nepal Sandarbha podcast can be scraped', async () => {
		const source = SourceConfig.filter((s) => s.sourceId === 'bbcmedia' && s.pages.some((p) => p.programId === 'NepalSandarbha'))[0]
		source.pages = source.pages.filter((p) => p.programId === 'NepalSandarbha')

		const podcasts = await PodcastCrawler([source], { headless: true, articleUrlLength: 3 })

		expect(podcasts.length).toBeGreaterThan(0)
		expect(podcasts[0].audioUrl).toBeTruthy()
	})

	it('Kayakairan podcast can be scraped', async () => {
		const source = SourceConfig.filter((s) => s.sourceId === 'Ujyalo' && s.pages.some((p) => p.programId === 'Kayakairan'))[0]
		source.pages = source.pages.filter((p) => p.programId === 'Kayakairan')

		const podcasts = await PodcastCrawler([source], { headless: true, articleUrlLength: 3 })

		expect(podcasts.length).toBeGreaterThan(0)
	})
})
