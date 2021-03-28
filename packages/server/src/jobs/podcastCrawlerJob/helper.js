require('dotenv').config()
const SourceConfig = require('../../config/source-config.json')
const Programs = require('../../config/programs')
const { categories } = require('../../config/category')

const assignWeights = (podcasts) => {
	const podcastsWithWeight = podcasts.map((podcast) => {
		podcast.weights = podcast.weights || {}
		podcast.weights.publisher = SourceConfig.find((config) => config.sourceId === podcast.sourceId).weight
		podcast.weights.program = Programs.find((program) => program.programId === podcast.programId).weight
		podcast.weights.category = categories.find((category) => category.name === podcast.category).weight

		return podcast
	})

	return podcastsWithWeight
}

module.exports = {
	assignWeights,
}
