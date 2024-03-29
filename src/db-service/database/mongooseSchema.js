const mongoose = require('mongoose')
const Schema = mongoose.Schema
const expiryTime = 5184000

const Podcast = mongoose.model(
	'Podcast',
	new Schema({
		title: { type: String, unique: true, required: true },
		description: String,
		imageUrl: String,
		originalAudioUrl: { type: String, required: true, unique: true },
		audioUrl: { type: String, required: true, unique: true },
		durationInSeconds: Number,
		category: String,
		programId: String,
		publisherId: String,
		weights: {
			publisher: Number,
			program: Number,
			category: Number,
			date: Number,
			user: Number,
		},
		createdDate: { type: Date, default: Date.now },
		modifiedDate: { type: Date, default: Date.now },
		createdAt: { type: Date, expires: expiryTime, default: Date.now },
	}),
)

const FavoriteFM = mongoose.model(
	'FavoriteFM',
	new Schema({
		nid: { type: String },
		fmId: { type: String },
	}),
)

module.exports = {
	Podcast,
	FavoriteFM,
}
