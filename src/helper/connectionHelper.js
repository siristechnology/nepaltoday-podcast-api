require('../config/env')
const mongoose = require('mongoose')

const dbConnection = () => {
	return process.env.DATABASE_URL ? mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true }) : true
}

module.exports = {
	dbConnection,
}
