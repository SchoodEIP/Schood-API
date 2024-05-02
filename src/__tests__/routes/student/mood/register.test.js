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

  describe('Register route', () => {
    it('POST /student/mood => Try register good request', async () => {
      const token = await funcs.login('alice.johnson.Schood1@schood.fr', 'Alice_123')
      funcs.setToken(token)

      const body = {
        mood: 2,
        comment: 'Test comment 2',
        annonymous: true
      }
      await funcs.post('/student/mood', body)
      const moods = await funcs.get('/student/mood')
      expect(moods.length).toBe(5)
    })

    it('POST /student/mood => Try register good request, no comment', async () => {
      const token = await funcs.login('alice.johnson.Schood1@schood.fr', 'Alice_123')
      funcs.setToken(token)

      const body = {
        mood: 2,
        annonymous: true
      }
      await funcs.post('/student/mood', body)
      const moods = await funcs.get('/student/mood')
      expect(moods.length).toBe(5)
    })

    it('POST /student/mood => Try register bad request, no mood', async () => {
      const token = await funcs.login('alice.johnson.Schood1@schood.fr', 'Alice_123')
      funcs.setToken(token)

      const body = {
        comment: 'Test comment 2',
        annonymous: true
      }
      const res = await funcs.post('/student/mood', body, 400)
      const moods = await funcs.get('/student/mood')
      expect(res.message).toBe('Invalid request')
      expect(moods.length).toBe(4)
    })

    it('POST /student/mood => Try register bad request, no annonymous', async () => {
      const token = await funcs.login('alice.johnson.Schood1@schood.fr', 'Alice_123')
      funcs.setToken(token)

      const body = {
        mood: 2,
        comment: 'Test comment 2'
      }
      const res = await funcs.post('/student/mood', body, 400)
      const moods = await funcs.get('/student/mood')
      expect(res.message).toBe('Invalid request')
      expect(moods.length).toBe(4)
    })
  })
})
