const mongoose = require('mongoose')

const server = require('../../serverUtils/testServer')
const dbDefault = require('../../../config/db.default')
const TestFunctions = require('../../serverUtils/TestFunctions')

describe('User route tests', () => {
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

  describe('getAllHelpNumbers route', () => {
    it('GET /user/helpNumbers => Try get all class user', async () => {
      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      const class_ = await funcs.getClass({ name: 200 })

      funcs.setToken(token)
      const res = await funcs.get(`/user/class/${class_._id}`, 200, /json/)
      expect(res).toHaveLength(3)
    })

    it('GET /user/helpNumbers => Try get all class user bad id', async () => {
      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')

      funcs.setToken(token)
      await funcs.get('/user/class/test', 400, /json/)
    })
  })
})
