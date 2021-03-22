const mongoose = require('mongoose')
const Schema = mongoose.Schema
const expiryTime = 604800

const Podcast = mongoose.model(
	'Podcast',
	new Schema({
		title: { type: String, required: true },
		description: String,
		imageUrl: String,
		originalAudioUrl: String,
		audioUrl: String,
		durationInSeconds: Number,
		category: String,
		programId: String,
		publisherId: String,
		createdDate: { type: Date, default: Date.now },
		modifiedDate: { type: Date, default: Date.now },
		createdAt: { type: Date, expires: expiryTime, default: Date.now },
	}),
)

const User = mongoose.model(
	'User',
	new Schema({
		nid: { type: String, unique: true },
		name: { type: String, required: true },
		firebaseUid: { type: String, unique: true },
		countryCode: String,
		timeZone: String,
		ipAddress: String,
		provider: String,
		createdDate: { type: Date, default: Date.now },
		modifiedDate: { type: Date, default: Date.now },
		status: String,
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
	User,
	Podcast,
	FavoriteFM,
}
