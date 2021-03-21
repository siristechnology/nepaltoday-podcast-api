const SourceConfig = require('./../../config/source-config.json')
const PodcastCrawler = require('news-crawler')
const uploadHelper = require('./uploadHelper')
const { Podcast } = require('../../db-service/database/mongooseSchema')

const getPodcastDuration = require('./getPodcastDuration')

module.exports = async function () {
	try {
		let podcasts = await PodcastCrawler(SourceConfig, { headless: true, articleUrlLength: 3 })
		podcasts = podcasts.filter((x) => x.imageLink.length > 5)
		podcasts = podcasts.filter((x) => x.audioUrl.length > 5)
		for (const podcast of podcasts) {
			const podcastSaved = await checkPodcast(podcast.audioUrl)
			if (!podcastSaved) {
				try {
					const s3Response = await uploadHelper(podcast)
					if (s3Response.success) {
						const duration = await getPodcastDuration(podcast.audioUrl)
						await savePodcastToDatabase(podcast, s3Response.response, duration)
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

const checkPodcast = async (link) => {
	const podcastRes = await Podcast.findOne({ originalAudioUrl: link }).lean()
	return podcastRes && podcastRes.link
}

const savePodcastToDatabase = async (podcast, s3Response, duration) => {
	console.log('printing podcast', podcast)

	const podcastObj = {
		author: podcast.sourceName,
		title: podcast.title,
		description: podcast.excerpt,
		imageUrl: podcast.imageLink,
		audioUrl: s3Response.Location,
		originalAudioUrl: podcast.audioUrl,
		link: podcast.link,
		duration: duration.duration,
		durationInSeconds: duration.durationInSeconds,
		category: podcast.category,
		program: podcast.program,
		programInEnglish: podcast.programInEnglish,
	}

	await Podcast.create(podcastObj)
}
