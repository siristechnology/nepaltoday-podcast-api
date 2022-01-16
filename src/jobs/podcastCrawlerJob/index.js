const SourceConfig = require('../../config/source-config.json')
const PodcastCrawler = require('news-crawler')
const uploadHelper = require('./uploadHelper')
const { Podcast } = require('../../db-service/database/mongooseSchema')
const getPodcastDurationInSeconds = require('./getPodcastDurationInSeconds')
const { assignWeights } = require('./helper')

module.exports = async function (config = SourceConfig) {
	try {
		let podcasts = await PodcastCrawler(config, { headless: true, articleUrlLength: 3 })
		podcasts = podcasts.filter((x) => x.audioUrl.length > 5)

		for (const podcast of podcasts) {
			const podcastSaved = await isPodcastInDb(podcast.audioUrl)
			if (!podcastSaved) {
				try {
					const s3Response = await uploadHelper(podcast)
					if (s3Response.success) {
						const durationInSeconds = await getPodcastDurationInSeconds(podcast.audioUrl)
						await savePodcastToDatabase(podcast, s3Response.response, durationInSeconds)
						console.log('podcast saved')
					}
				} catch (err) {
					console.log('Error saving', err)
				}
			}
		}
	} catch (error) {
		console.log(error)
	}
}

const isPodcastInDb = async (link) => {
	const podcastRes = await Podcast.findOne({ originalAudioUrl: link }).lean()
	return podcastRes && podcastRes.audioUrl
}

const savePodcastToDatabase = async (podcast, s3Response, durationInSeconds) => {
	const podcastObj = {
		...podcast,
		author: podcast.sourceName,
		description: podcast.excerpt,
		audioUrl: s3Response.Location,
		originalAudioUrl: podcast.audioUrl,
		durationInSeconds,
		publisherId: podcast.sourceId,
	}

	const podcastWithWeight = assignWeights([podcastObj])

	try {
		await Podcast.create(podcastWithWeight)
	} catch {}
}
