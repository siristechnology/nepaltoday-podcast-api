const path = require('path')
require('dotenv').config({
	path: path.join(__dirname, '../../../.env'),
})
require('../../config/firebaseInit.js')

const TestDbServer = require('../../db-service/tests/test-db-server.js')

beforeAll(async () => await TestDbServer.connect())
afterEach(async () => await TestDbServer.clearDatabase())
afterAll(async () => await TestDbServer.closeDatabase())

const {
	Mutation: { loginUser },
} = require('../resolvers')

describe('Resolvers Mutation loginUser', () => {
	it('should FAIL with invalid token', async () => {
		expect.assertions(1)

		await loginUser(null, { accessToken: 'INVALID_TOKEN' }, {}).catch((error) => {
			expect(error).toBeInstanceOf(Error)
		})
	})

	it('should SUCCEED with valid token', async () => {
		await loginUser(
			null,
			{
				loginInput: {
					provider: 'google',
					accessToken:
						'ya29.a0AfH6SMDSf4KqMWbFBnr9aA0wPrTIUV7VkCTJxNQyMtdf2RcVRv3MIItLR8xiW00OP4vdfahbLhkfpb7JsBEEd_vap-M7cr03iPUg3uCmh0EhSGo98CgnnJGvonzuHx1MC8lz-PTuR1tCeySzoHsp6Gurz0-2',
				},
			},
			{},
		)
	})
})
