const moment = require('moment')

const calculateTotalWeights = async (podcasts) => {
	const podcastWithWeights = podcasts.map((podcast) => {
		podcast.weights = podcast.weights || {}
		podcast.weights.date = getDateWeight(podcast.createdDate)
		podcast.totalWeight =
			(podcast.weights.publisher || 0) +
			(podcast.weights.program || 0) +
			(podcast.weights.category || 0) +
			(podcast.weights.date || 0)
		podcast.totalWeight = isNaN(podcast.totalWeight) ? 0 : podcast.totalWeight
		return podcast
	})

	return podcastWithWeights
}

const getDateWeight = (date) => {
	const now = moment.utc()
	const end = moment(date)
	const duration = moment.duration(now.diff(end))
	const diffMins = duration.asMinutes()

	if (diffMins < 60) {
		return 10
	} else if (diffMins < 4 * 60) {
		return 9
	} else if (diffMins < 24 * 60) {
		return 8
	} else {
		return 7
	}
}

module.exports = { calculateTotalWeights }
