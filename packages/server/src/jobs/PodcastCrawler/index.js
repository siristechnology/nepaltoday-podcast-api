const NewsCrawler = require('news-crawler')
const { saveArticles } = require('../../db-service/newsDbService')
const SourceConfig = require('../../config/source-config.json')
const logger = require('../../config/logger')
const { getTagsFromArticle, assignWeights } = require('./helper')
const { Article, TrendingTopic } = require('../../db-service/database/mongooseSchema')
const { convertArticleDateToAD } = require('./dateConverter')

module.exports = async function () {
	const ipAddress = require('ip').address()

	try {
		let articles = await NewsCrawler(SourceConfig, { headless: true })
		articles = articles.filter((a) => a.imageLink !== null)

		let cartoonArticles = articles.filter((x) => x.category == 'cartoon')
		cartoonArticles = cartoonArticles.map((article) => {
			article.title = article.imageLink
			return article
		})
		const exceptCartoonArticles = articles.filter((x) => x.category != 'cartoon')

		let dateConvertedCartoonArticles = []
		cartoonArticles.map((article) => {
			dateConvertedCartoonArticles.push(convertArticleDateToAD(article))
		})

		articles = exceptCartoonArticles.concat(dateConvertedCartoonArticles)

		const trendingTopics = await TrendingTopic.find()
		const savedArticles = await Article.find({ createdDate: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } })
		const articleWithTags = []

		const nonHeadlineArticles = articles.filter((x) => x.category !== 'headline')
		const savedHeadlineArticles = savedArticles.filter((x) => x.category === 'headline')
		for (const article of nonHeadlineArticles) {
			const repeated = savedHeadlineArticles.filter((x) => x.link === article.link)
			if (repeated.length > 0) {
				await Article.findOneAndUpdate({ link: repeated[0].link }, { category: article.category })
			}
		}

		for (const article of articles) {
			if (savedArticles.filter((x) => x.title === article.title).length === 0) {
				if (trendingTopics.length > 0) {
					article.tags = getTagsFromArticle(trendingTopics[0].topics, article.content)
				}
				articleWithTags.push(article)
			}
		}

		const newArticles = articleWithTags.filter((article) => !savedArticles.some((sa) => sa.link === article.link))
		const newArticlesWithWeight = assignWeights(newArticles)

		newArticlesWithWeight.forEach((x) => {
			x.hostIp = ipAddress
			x.shortDescription = x.shortDescription || '..'
		})
		await saveArticles(newArticlesWithWeight)

		logger.info(`News Crawler ran! Articles Saved: ${newArticlesWithWeight.length}`, { date: new Date().toISOString() })
	} catch (error) {
		logger.error('Error while crawling:', error)
	}
}
