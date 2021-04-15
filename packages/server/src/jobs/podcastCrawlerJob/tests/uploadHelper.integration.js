require('dotenv').config()
const uploadHelper = require('../uploadHelper')

jest.setTimeout(120000)

describe('uploadHelper', () => {
	it('integration test', async () => {
		const podcast = {
			_id: '6078a3db58b88200427e5c9d',
			audioUrl: 'http://open.live.bbc.co.uk/mediaselector/6/redir/version/2.0/mediaset/audio-nondrm-download-low/proto/http/vpid/p085v5bn.mp3',
			durationInSeconds: 926,
			category: 'Politics',
			programId: 'NepalSandarbha',
			publisher: {
				id: 'bbcmedia',
			},
			createdDate: '1618519003931',
		}

		const response = await uploadHelper(podcast)

		console.log('printing response', response)
	})
})
