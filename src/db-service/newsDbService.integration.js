require('dotenv').config()
const newsDbService = require('./newsDbService.js')
const mongoose = require('mongoose')
mongoose.promise = global.Promise

jest.setTimeout(200000)

describe('NewsDbService', () => {
	beforeAll(() => {
		mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
	})
	it('saveArticle should save an article successfully.', async () => {
		const article = {
			title: 'dummy title ' + Math.random(),
			link: 'link' + Math.random(),
			imageLink: 'imageLink',
			sourceName: 'Swasthya Khabar',
		}
		const articlesSaved = await newsDbService.saveArticle(article)

		expect(articlesSaved._id).not.toBeNull()
		expect(articlesSaved.createdDate).not.toBeUndefined()
		expect(articlesSaved.modifiedDate).not.toBeUndefined()

		await newsDbService.deleteArticles({ _id: articlesSaved._id })
	})

	it('getLatestNewsArticle should return lastest news', async () => {
		const singleArticle = await newsDbService.getLatestNewsArticle()
		expect(singleArticle).not.toBeUndefined()
	})

	it('saveArticle should not save publishedDate by default.', async () => {
		const article = {
			title: 'dummy title' + Math.random(),
			link: 'link' + Math.random(),
			imageLink: 'imageLink',
		}
		const articlesSaved = await newsDbService.saveArticles([article])

		expect(articlesSaved[0].publishedDate).toBeUndefined()

		await newsDbService.deleteArticles({ _id: articlesSaved[0]._id })
	})

	it('saveArticle should save given publishedDate.', async () => {
		const date1 = new Date(2013, 4, 30, 16, 5)
		const article = { title: 'dummy title one' + Math.random(), link: 'abc.com' + Math.random(), publishedDate: date1 }
		const articlesSaved = await newsDbService.saveArticles([article])
		expect(articlesSaved[0]).not.toBeUndefined()
		expect(articlesSaved[0].publishedDate).to.equal(date1)
		await newsDbService.deleteArticles({ _id: articlesSaved[0]._id })
	})

	it('saveArticles() should save source too.', async () => {
		const date1 = new Date(2013, 4, 30, 16, 5)
		const sources = await newsDbService.getAllSources()
		const article = {
			title: 'dummy title two' + Math.random(),
			link: 'link' + Math.random(),
			publishedDate: date1,
			sourceName: sources[0].name,
		}
		const articlesSaved = await newsDbService.saveArticles([article])
		expect(articlesSaved[0]).not.toBeUndefined()
		expect(articlesSaved[0].source.sourceName).to.equal(sources[0].name)
	})

	it('saveArticles() should save multile sources', async () => {
		const article1 = { title: 'dummy title ' + Math.random, link: 'link' + Math.random() }
		const article2 = { title: 'dummy title 0002' + Math.random, link: 'link' + Math.random() }
		const articlesSaved = await newsDbService.saveArticles([article1, article2])
		expect(articlesSaved[0]).not.toBeUndefined()

		expect(articlesSaved[1]).not.toBeUndefined()
		await newsDbService.deleteArticles({ _id: articlesSaved[0]._id })
		await newsDbService.deleteArticles({ _id: articlesSaved[1]._id })
	})
})

describe('newsDbService', () => {
	it('getArticles() should fetch news from mongodb.', async () => {
		const articles = await newsDbService.getArticles()
		expect(articles).not.toBeUndefined()
		expect(articles).to.have.length.greaterThan(0)
	})
})

describe('newsDbService', () => {
	it('getAllSources() should get all sources.', async () => {
		const sources = await newsDbService.getAllSources()
		expect(sources).not.toBeUndefined()
		expect(sources).to.have.length.greaterThan(1)
	})
})
