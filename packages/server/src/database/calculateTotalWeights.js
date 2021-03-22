const moment = require('moment')
const { calculateUserSpecificWeight } = require('./../db-service/UserDbService')

const calculateTotalWeights = async (podcasts, nid) => {
	const userSpecificWeight = await calculateUserSpecificWeight(nid)
	return podcasts.map((podcast) => {
		podcast.weights = podcast.weights || {}
		podcast.weights.date = getDateWeight(podcast.createdDate)
		let userWeight = userSpecificWeight.filter((x) => x.category == podcast.category)[0]
		if (!userWeight) userWeight = { weight: 0 }
		podcast.totalWeight = podcast.weights.source + podcast.weights.category + podcast.weights.date + userWeight.weight
		podcast.totalWeight = isNaN(podcast.totalWeight) ? 0 : podcast.totalWeight
		return podcast
	})
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
