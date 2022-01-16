const newsDbService = require('./newsDbService.js')
const { Article } = require('./database/mongooseSchema')

require('dotenv').config()

describe('NewsDbService', () => {
	it('saveArticle call Article insertMany.', async () => {
		const spyArticleInsertMany = jest.spyOn(Article, 'insertMany').mockImplementation(() => {})

		const article = {
			title: 'dummy title',
			link: 'link',
			imageLink: 'imageLink',
		}
		await newsDbService.saveArticles([article])

		expect(spyArticleInsertMany).toHaveBeenCalledWith([article], expect.anything())
	})
})
