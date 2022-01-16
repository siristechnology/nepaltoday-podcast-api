const {
	Query: { getArticles },
} = require('../resolvers')

const mockingoose = require('mockingoose').default
const { GetMockArticle } = require('../mocks')
const mongooseSchema = require('../../db-service/database/mongooseSchema')

describe('Resolvers Query getArticles', () => {
	it('should call Article.find for each category', async () => {
		mongooseSchema.Article.schema.path('source', Object)
		mockingoose(mongooseSchema.Article).toReturn([GetMockArticle(), GetMockArticle()], 'find')

		const articles = await getArticles(null, {}, mongooseSchema)

		expect(articles.length).toBeGreaterThan(0)
	})
})