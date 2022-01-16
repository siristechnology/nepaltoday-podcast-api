const winston = require('winston')
require('dotenv').config()

const logger = winston.createLogger({
	transports: [new winston.transports.Console({ handleExceptions: true, handleRejections: true, level: process.env.LOG_LEVEL })],
	exitOnError: false,
})

logger.on('error', (error) => {
	try {
		// eslint-disable-next-line no-console
		console.log('Winston Logger crashed', error)
	} catch {}
})

module.exports = logger
