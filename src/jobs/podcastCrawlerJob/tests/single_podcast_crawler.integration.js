const PodcastCrawler = require('news-crawler')
const SourceConfig = require('../../../config/source-config.json')

jest.setTimeout(180000)

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

	it('TED Talks podcast can be scraped', async () => {
		const source = SourceConfig.filter((s) => s.sourceId === 'ted' && s.pages.some((p) => p.programId === 'TEDTalksDaily'))[0]
		source.pages = source.pages.filter((p) => p.programId === 'TEDTalksDaily')

		const podcasts = await PodcastCrawler([source], { headless: true, articleUrlLength: 3 })

		expect(podcasts.length).toBeGreaterThan(0)
	})

	it('Global News podcast can be scraped', async () => {
		const source = SourceConfig.filter((s) => s.sourceId === 'bbcmedia' && s.pages.some((p) => p.programId === 'GlobalNews'))[0]
		source.pages = source.pages.filter((p) => p.programId === 'GlobalNews')

		const podcasts = await PodcastCrawler([source], { headless: true, articleUrlLength: 3 })

		expect(podcasts.length).toBeGreaterThan(0)
	})

	it('All programs can be scraped.', async (done) => {
		const podcasts = await PodcastCrawler(SourceConfig.slice(0, 1), { headless: true, articleUrlLength: 3 })

		const totalPodcastsByProgram = podcasts.reduce((accumulator, pod) => {
			accumulator[pod.programId] = (accumulator[pod.programId] || 0) + 1
			return accumulator
		}, {})

		for (const [programId, count] of Object.entries(totalPodcastsByProgram)) {
			if (count < 1) {
				done.fail(new Error(`No podcasts from "${programId}"`))
			}
		}
	})
})
