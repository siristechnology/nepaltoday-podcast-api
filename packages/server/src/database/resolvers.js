/* eslint-disable eqeqeq */
const _ = require('lodash')
const { categories } = require('../config/category')
const getWeather = require('../weather')
const logger = require('../config/logger')
const SourceConfig = require('../config/source-config.json')
const { fmDetails } = require('./../config/fm')
const { calculateTotalWeights } = require('./calculateTotalWeights')

module.exports = {
	Query: {
		getPodcasts: async (parent, args, { Podcast }) => {
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
					id: publisher.id,
					name: publisher.sourceName,
					imageUrl: process.env.SERVER_BASE_URL + publisher.imageUrl,
				}
				return podcast
			})

			return podcastList
		},

		getWeatherInfo: async (parent, args, { ipAddress }) => {
			try {
				if (ipAddress === '::1' || ipAddress === '::ffff:127.0.0.1') ipAddress = '27.111.16.0'
				logger.debug(`Printing ip: ${ipAddress}`)

				const weatherInfo = await getWeather(ipAddress)
				weatherInfo.ipAddress = ipAddress

				return {
					ipAddress: ipAddress,
					temperature: weatherInfo.main.temp,
					condition: weatherInfo.weather[0].main,
					description: weatherInfo.weather[0].description,
					place: weatherInfo.name,
				}
			} catch (error) {
				logger.error(`Error to getWeatherInfo for ip: ${ipAddress}`)
			}
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
