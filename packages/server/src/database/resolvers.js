/* eslint-disable eqeqeq */
const _ = require('lodash')
const { categories } = require('../config/category')
const logger = require('../config/logger')
const SourceConfig = require('../config/source-config.json')
const Programs = require('../config/programs')
const { Podcast } = require('../db-service/database/mongooseSchema')
const { fmDetails } = require('./../config/fm')
const { calculateTotalWeights } = require('./calculateTotalWeights')

module.exports = {
	Query: {
		getTopPodcasts: async (parent, args, { Podcast }) => {
			args.criteria = args.criteria || {}
			args.criteria.categories = args.criteria.categories || categories
			args.criteria.nid = args.criteria.nid || ''
			const promises = args.criteria.categories.map(async (category) => {
				const _podcasts = await Podcast.find({
					category: category.name,
					audioUrl: { $ne: null },
				})
					.lean()
					.sort({ _id: -1 })
					.limit(category.count || 20)

				const totalWeights = await calculateTotalWeights([..._podcasts], args.criteria.nid)

				return totalWeights
			})

			const podcasts = await Promise.all(promises)

			let podcastFlattened = _.flatten(podcasts)
			podcastFlattened = podcastFlattened.sort((a, b) => b.totalWeight - a.totalWeight)

			const podcastList = podcastFlattened.map((podcast) => {
				const publisher = SourceConfig.find((x) => x.sourceId === podcast.publisherId)
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
			})

			return podcastList
		},

		getAllPrograms: async () => {
			return Programs
		},

		getProgramDetail: async (parent, args) => {
			const program = Programs.find((p) => p.id == args.id)

			if (program) {
				program.podcasts = await Podcast.find({
					programId: program.id,
				})
					.lean()
					.sort({ _id: -1 })
					.limit(20)
			}

			return program
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

	Mutation: {
		saveUser: async (parent, args, { ipAddress }) => {
			const {
				input: { nid, fcmToken, countryCode, timeZone, createdDate, modifiedDate },
			} = args

			const response = await User.update(
				{ nid },
				{
					$set: {
						fcmToken,
						countryCode,
						timeZone,
						ipAddress,
						createdDate: createdDate || modifiedDate,
						modifiedDate: modifiedDate || createdDate,
					},
				},
				{ upsert: true },
			)

			return { success: !!response.ok }
		},
	},
}
