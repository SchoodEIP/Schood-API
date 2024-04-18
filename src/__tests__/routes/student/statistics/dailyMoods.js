const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')
const TestFunctions = require('../../../serverUtils/TestFunctions')

describe('Student statistics route tests', () => {
  let app
  let funcs

  beforeAll(async () => {
    process.env.PROD = false
    app = await server.testServer()
    funcs = new TestFunctions(app)
  })

  afterEach(async () => {
    const collections = mongoose.connection.collections
    for (const key in collections) {
      const collection = collections[key]
      await collection.deleteMany()
    }
    await dbDefault(true)
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
  })

  describe('Statistics dailyMoods route', () => {
    it('POST /student/statistics/dailyMoods => Try good request', async () => {
      const token = await funcs.login('alice.johnson.Schood1@schood.fr', 'Alice_123')
      funcs.setToken(token)

      const body = {
        fromDate: '2024-02-18T00:00:00.000Z',
        toDate: '2024-02-26T23:59:59.000Z'
      }
      const res = await funcs.post('/student/statistics/dailyMoods', body)

      expect(Object.keys(res).length).toBe(5)
      expect(res['2024-02-24']).toBe(1)
      expect(res.averagePercentage).toBe(40)
    })

    it('POST /student/statistics/dailyMoods => Try good request no dailyMood register', async () => {
      const token = await funcs.login('alice.johnson.Schood1@schood.fr', 'Alice_123')
      funcs.setToken(token)

      mongoose.connection.collections.dailymoods.deleteMany()

      const body = {
        fromDate: '2024-02-18T00:00:00.000Z',
        toDate: '2024-02-26T23:59:59.000Z'
      }
      const res = await funcs.post('/student/statistics/dailyMoods', body)

      expect(res.averagePercentage).toBe('NaN')
    })

    it('POST /student/statistics/dailyMoods => Try bad request fromDate missing', async () => {
      const token = await funcs.login('alice.johnson.Schood1@schood.fr', 'Alice_123')
      funcs.setToken(token)

      const body = {
        toDate: '2024-02-26T23:59:59.000Z'
      }
      const res = await funcs.post('/student/statistics/dailyMoods', body, 400)

      expect(res.message).toBe('Date range missing')
    })

    it('POST /student/statistics/dailyMoods => Try bad request toDate missing', async () => {
      const token = await funcs.login('alice.johnson.Schood1@schood.fr', 'Alice_123')
      funcs.setToken(token)

      const body = {
        fromDate: '2024-02-26T23:59:59.000Z'
      }
      const res = await funcs.post('/student/statistics/dailyMoods', body, 400)

      expect(res.message).toBe('Date range missing')
    })
  })
})
