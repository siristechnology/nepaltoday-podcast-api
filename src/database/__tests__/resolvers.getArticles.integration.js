const mongooseSchema = require('../../db-service/database/mongooseSchema')
const { getArticles } = require('../../db-service/newsDbService')

const { dbConnection } = require('../../helper/connectionHelper')
jest.setTimeout(200000)

let con

beforeAll(async () => {
	con = await dbConnection()
})

afterAll(async () => {
	if (con && con.connection) {
		await con.connection.close()
	}
})

describe('get articles according to user preference', () => {
	it('get articles according to user preference', async () => {
		let readArticleData = {
			nid: "testnid",
			article:[
				{
					articleId: "testarticleId1",
					category: "sports"
				},
				{
					articleId: "testarticleId2",
					category: "sports"
				}
			]
		}
		let readArticleObj = new mongooseSchema.ReadArticle(readArticleData)
		await readArticleObj.save()
		
		const articles = await getArticles(null, {criteria: {nid:"testnid"}}, mongooseSchema)
		const sportArticle = articles.find(article=>article.category=='sports')
		const newsArticle = articles.find(article=> article.category=='news')
		await mongooseSchema.ReadArticle.deleteOne({nid: "testnid"})
		expect(articles.indexOf(sportArticle)).toBeGreaterThan(articles.indexOf(newsArticle))
	})
})
