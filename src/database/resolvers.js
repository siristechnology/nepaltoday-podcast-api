const _ = require('lodash')
const logger = require('../config/logger')
const SourceConfig = require('../config/source-config.json')
const Programs = require('../config/programs')
const { Podcast, User } = require('../db-service/database/mongooseSchema')
const { fmDetails } = require('../config/fm')
const { calculateTotalWeights } = require('./calculateTotalWeights')

module.exports = {
	Query: {
		getTopPodcasts: async (parent, args) => {
			const agg = Podcast.aggregate([
				{ $sort: { _id: -1, createdDate: -1 } },
				{
					$group: {
						_id: '$programId',
						latestPodcast: { $first: '$$ROOT' },
					},
				},
			])

			let podcasts = []
			for await (const pod of agg) {
				podcasts.push(pod.latestPodcast)
			}

			const podcastWithWeights = await calculateTotalWeights(podcasts)
			const podcastsSorted = podcastWithWeights.sort((a, b) => b.createdDate - a.createdDate).sort((a, b) => b.totalWeight - a.totalWeight)

			return populateProgramDetailsInPodcasts(podcastsSorted.filter((p) => p))
		},

		getAllPrograms: async () => {
			return Programs
		},

		getProgramDetail: async (parent, args) => {
			const program = Programs.find((p) => p.id == args.id)
			const publisher = SourceConfig.find((x) => x.sourceId === program.publisher.id)

			if (program) {
				program.podcasts = await Podcast.find({
					programId: program.id,
				})
					.lean()
					.sort({ _id: -1 })
					.limit(20)

				program.podcasts.forEach((pod) => {
					pod.program = {
						id: program.programId,
						title: program.program,
						imageUrl: program.imageUrl,
						category: program.category,
					}
					pod.publisher = {
						id: publisher.sourceId,
						title: publisher.sourceName,
						imageUrl: process.env.SERVER_BASE_URL + publisher.imageUrl,
					}
				})
			}

			return program
		},

		searchPodcasts: async (parent, args) => {
			const { searchTerm } = args
			const regexTerm = `\\b${searchTerm.trim().toLowerCase()}`
			const searchRegex = new RegExp(regexTerm, 'gmi')

			const matchingProgramIds = Programs.filter(
				(program) => searchRegex.test(program.programInEnglish.toLowerCase()) || searchRegex.test(program.publisher.title.toLowerCase()),
			).map((p) => p.id)

			const matchingPodcasts = await Podcast.find({
				$or: [
					{ title: { $regex: regexTerm, $options: 'gmi' } },
					{ description: { $regex: regexTerm, $options: 'gmi' } },
					{ programId: { $in: matchingProgramIds } },
				],
			}).lean()

			return populateProgramDetailsInPodcasts(matchingPodcasts).slice(0, 20)
		},

		getFmList: async (parent, args, { FM }) => {
			return fmDetails
		},

		getMyFavoriteFm: async (parent, { nid }) => {
			const myFavorites = await FavoriteFM.find({ nid })
			const myFavoriteFm = []
			myFavorites.forEach((favorite) => {
				const myFm = fmDetails.find((x) => x.id == favorite.fmId)
				myFm && myFavoriteFm.push(myFm)
			})
			return myFavoriteFm
		},

		getMyFm: async (parent, { nid }) => {
			const myFavorites = await FavoriteFM.find({ nid })
			const myFavoriteFm = []
			myFavorites.forEach((favorite) => {
				const myFm = fmDetails.find((x) => x.id == favorite.fmId)
				myFm && myFavoriteFm.push(myFm)
			})
			return {
				allFm: fmDetails,
				favoriteFm: myFavoriteFm,
			}
		},
	},
}

const populateProgramDetailsInPodcasts = (podcasts) => {
	return podcasts.map((podcast) => {
		const publisher = SourceConfig.find((x) => x.sourceId === podcast.publisherId && x.pages.some((p) => p.programId === podcast.programId))
		if (publisher) {
			podcast.publisher = {
				id: publisher.sourceId,
				title: publisher.sourceName,
				imageUrl: process.env.SERVER_BASE_URL + publisher.imageUrl,
			}
			const program = publisher.pages.find((p) => p.programId === podcast.programId)
			podcast.program = {
				id: program.programId,
				title: program.program,
				imageUrl: program.imageUrl,
				category: program.category,
			}
			return podcast
		}
	})
}
