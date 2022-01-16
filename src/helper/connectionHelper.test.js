const { dbConnection } = require('./connectionHelper')

describe('connection testing', () => {
	it('test connection', async () => {
		const con = await dbConnection()
		expect(con).toBeDefined()
	})
})
