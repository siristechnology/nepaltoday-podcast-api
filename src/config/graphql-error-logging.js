const logger = require('./logger')

module.exports = {
	requestDidStart() {
		return {
			didEncounterErrors(requestContext) {
				logger.error('graphql error(s) from requestContext', requestContext.errors)
			},
		}
	},
}
