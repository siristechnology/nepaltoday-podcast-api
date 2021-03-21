require('dotenv').config()
const SourceConfig = require('../../config/source-config.json')
const { categories } = require('../../config/category')

const assignWeights = (articles) => {
	const articlesWithWeight = articles.map((article) => {
		article.weights = article.weights || {}
		article.weights.source = SourceConfig.find((config) => config.sourceName === article.sourceName).weight
		article.weights.category = categories.find((category) => category.name === article.category).weight

		return article
	})

	return articlesWithWeight
}

const getTagsFromArticle = (trendingTopics, content) => {
	const tags = []
	trendingTopics.forEach((topic) => {
		if (content.indexOf(topic) >= 0) {
			tags.push(topic)
		}
	})
	return tags
}

module.exports = {
	getTagsFromArticle,
	assignWeights,
}
