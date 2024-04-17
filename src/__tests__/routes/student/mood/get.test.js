const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const TestFunctions = require('../../../serverUtils/TestFunctions')
const dbDefault = require('../../../../config/db.default')

describe('Student route tests', () => {
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

  describe('Get route', () => {
    it('GET /student/mood => Try get', async () => {
      const token = await funcs.login('alice.johnson.Schood1@schood.fr', 'Alice_123')
      funcs.setToken(token)

      const moods = await funcs.get('/student/mood')
      expect(moods.length).toBe(4)
    })
  })
})
