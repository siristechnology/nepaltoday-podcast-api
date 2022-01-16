const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const mongod = new MongoMemoryServer()

module.exports = {
	connect: async () => {
		const uri = await mongod.getConnectionString()

		await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
	},

	clearDatabase: async () => {
		const collections = mongoose.connection.collections

		for (const key in collections) {
			const collection = collections[key]
			await collection.deleteMany()
		}
	},

	closeDatabase: async () => {
		try {
			await mongoose.connection.dropDatabase()
			await mongoose.connection.close()
			await mongod.stop()
		} catch {}
	},
}
