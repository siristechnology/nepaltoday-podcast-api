import RunJobs from '../start-jobs'

jest.setTimeout(120000)

describe('start jobs', () => {
	it('should run all jobs successfully', async () => {
		await RunJobs()
	})
})
