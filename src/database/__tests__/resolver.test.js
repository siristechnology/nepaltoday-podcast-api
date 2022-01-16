const { graphqlTestCall } = require('../graphqlTestCall')
const { dbConnection } = require('../../helper/connectionHelper')

const query = `
query getArticleQuery {
  getArticles { _id, title }
}
`

let con

beforeAll(async () => {
	con = await dbConnection()
})

afterAll(async () => {
	if (con.connection) {
		await con.connection.close()
	}
})

describe('Graphql Resolvers', () => {
	it('get articles', async () => {
		const articles = await graphqlTestCall(query)
		expect(articles).toBeDefined()
	})
})
