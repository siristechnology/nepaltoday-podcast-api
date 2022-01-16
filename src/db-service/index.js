require('dotenv').config()
const userDbService = require('./UserDbService.js')
const newsDbService = require('./newsDbService.js')
const mongooseSchema = require('./database/mongooseSchema')
// const mongoose = require('mongoose')
// mongoose.promise = global.Promise
// mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

module.exports = {
	newsDbService,
	mongooseSchema,
	userDbService,
}
