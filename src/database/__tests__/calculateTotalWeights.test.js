const { calculateTotalWeights } = require('../calculateTotalWeights')

describe('calculateTotalWeights', () => {
	it('should calculate total weights', async () => {
		const articles = [
			{
				title: 'Sample article',
				publishedDate: Date.UTC(),
				weights: {
					source: 8,
					category: 10,
				},
			},
		]

		const articlesWithWeight = await calculateTotalWeights(articles,'')

		expect(articlesWithWeight[0].totalWeight).toBeGreaterThan(24)
	})
})
