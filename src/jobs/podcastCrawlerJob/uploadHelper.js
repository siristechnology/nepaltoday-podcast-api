const AWS = require('aws-sdk')
const axios = require('axios')

module.exports = async (podcast) => {
	const inputStream = await axios({ url: podcast.audioUrl, responseType: 'stream' })

	const s3bucket = new AWS.S3({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	})

	const params = {
		Bucket: process.env.AWS_S3_BUCKET_NAME,
		Key: podcast.programId + '/' + getFormattedDate(podcast.createdDate) + '.mp3',
		Body: inputStream.data,
		ACL: 'public-read',
		ContentType: 'audio/mp3',
	}

	try {
		const s3Response = await s3bucket.upload(params).promise()
		return { success: true, response: s3Response }
	} catch (error) {
		console.log('Err in uploading', error)
		return { success: false }
	}
}

const getFormattedDate = () => {
	const date = new Date()
	return date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate() + '-' + date.getUTCHours() + '-' + date.getUTCMinutes()
}
