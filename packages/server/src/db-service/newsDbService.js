const { Article, FacebookPosts } = require('./database/mongooseSchema')
const logger = require('../config/logger')
const SourceConfig = require('../config/source-config.json')

module.exports = {
	saveArticles: async (articles) => {
		try {
			const savedArticles = await Article.insertMany(articles, { ordered: false })
			return savedArticles
		} catch (error) {
			if (error.code === 11000 || error.code === 11001) {
				logger.debug('ignored duplicates')
			} else {
				logger.error('Error on saveArticles:', error)
			}
			return error
		}
	},

	saveArticle: async (article) => {
		try {
			return await Article.create(article)
		} catch (error) {
			if (error.code === 11000 || error.code === 11001) {
				logger.debug('ignored duplicates')
			} else {
				logger.error('Error on saveArticle:', error)
			}
		}
		return null
	},

	deleteArticles: async (conditions) => {
		const deletedArticles = await Article.deleteMany(conditions)
		return deletedArticles
	},

	getArticles: async () => {
		const newsArticles = await Article.find()
		return newsArticles
	},

	getLatestNewsArticle: async () => {
		const latestNewsArticle = await Article.find({ category: 'news' }).sort({ _id: -1 }).limit(1).lean()

		const articleWithSource = latestNewsArticle.map((article) => {
			const mySource = SourceConfig.find((x) => x.sourceName === article.sourceName)
			article.source = {
				name: mySource.name,
				url: mySource.link,
				logoLink: process.env.SERVER_BASE_URL + mySource.logoLink,
			}
			return article
		})

		return articleWithSource
	},

	getAllSources: () => {
		return SourceConfig
	},

	isExist: async (newslink) => {
		const count = await Article.count({ link: newslink })
		return count > 0
	},

	checkFacebookPostExist: async (articleLink) => {
		const count = await FacebookPosts.countDocuments({ articleLink })
		if (count > 0) return true
		else return false
	},

	saveFacebookPost: async (articleLink) => {
		const newsLink = new FacebookPosts({ articleLink })
		await newsLink.save()
	},
}
