require('./config/env')

const morgan = require('morgan')
const express = require('express')
const path = require('path')
const timeout = require('connect-timeout')
const helmet = require('helmet')
const requireGraphQLFile = require('require-graphql-file')
const { ApolloServer, gql } = require('apollo-server-express')
require('./db-service/initialize')
const mongooseSchema = require('./db-service/database/mongooseSchema')
const resolvers = require('./database/resolvers')
const colors = require('colors/safe')
const Agenda = require('agenda')
const Agendash = require('agendash')
const GraphQlErrorLoggingPlugin = require('./config/graphql-error-logging')

require('./config/firebaseInit')

const isDevelopment = process.env.NODE_ENV === 'development'

const app = express()

app.use(timeout('30s'))
app.use((req, res, next) => {
	if (!req.timedout) {
		next()
	}
})
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('combined'))
app.use('/assets', express.static('assets'))

const agenda = new Agenda({ db: { address: process.env.DATABASE_READONLY_URL } })
app.use('/dash', Agendash(agenda))

const typeDefSchema = requireGraphQLFile('./database/typeDefs.graphql')
const typeDefs = gql(typeDefSchema)

const apolloServer = new ApolloServer({
	typeDefs: typeDefs,
	resolvers: resolvers,
	context: ({ req, res }) => ({
		...{ userContext: req.payload, ipAddress: getIpAdressFromRequest(req) },
		...mongooseSchema,
	}),
	plugins: [GraphQlErrorLoggingPlugin],
})
apolloServer.applyMiddleware({ app })

const getIpAdressFromRequest = (req) => {
	let ipAddr = req.headers['x-forwarded-for']
	if (ipAddr) {
		ipAddr = ipAddr.split(',')[0]
	} else {
		ipAddr = req.connection.remoteAddress || req.ip
	}

	return ipAddr
}

app.use((err, req, res, next) => {
	res.status(err.status || 500)

	res.send({
		error: {
			message: err.message,
			stacktrace: isDevelopment ? err.stack : {},
		},
	})
})

app.listen(process.env.PORT, () => console.log(colors.rainbow(`Server running on http://localhost:${process.env.PORT}`)))
