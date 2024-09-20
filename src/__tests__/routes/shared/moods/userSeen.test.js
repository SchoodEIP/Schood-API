const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')
const TestFunctions = require('../../../serverUtils/TestFunctions')

describe('Shared route tests', () => {
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

  describe('UserSeen route', () => {
    it('POST /shared/moods/userSeen/:id => Try mood seen teacher', async () => {
      const token = await funcs.login('pierre.dubois.Schood1@schood.fr', 'Pierre_123')

      funcs.setToken(token)

      let mood = await funcs.getMood({})
      expect(mood.seen).toBe(false)
      await funcs.post(`/shared/moods/userSeen/${mood._id}`)

      mood = await funcs.getMood({ _id: mood._id })
      expect(mood.seen).toBe(true)
    })

    it('POST /shared/moods/userSeen/:id => Try mood seen adm', async () => {
      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')

      funcs.setToken(token)

      let mood = await funcs.getMood({})
      expect(mood.seen).toBe(false)
      await funcs.post(`/shared/moods/userSeen/${mood._id}`)

      mood = await funcs.getMood({ _id: mood._id })
      expect(mood.seen).toBe(true)
    })

    it('POST /shared/moods/userSeen/:id => Try mood seen teacher forbidden', async () => {
      const token = await funcs.login('marie.leclerc.Schood1@schood.fr', 'Marie_123')

      funcs.setToken(token)

      const user = await funcs.getUser({ email: 'jean-pierre.lefevre.Schood1@schood.fr' })
      let mood = await funcs.getMood({ user: user._id })
      expect(mood.seen).toBe(false)
      await funcs.post(`/shared/moods/userSeen/${mood._id}`, {}, 403)

      mood = await funcs.getMood({ _id: mood._id })
      expect(mood.seen).toBe(false)
    })

    it('POST /shared/moods/userSeen/:id => Try mood seen no moods find', async () => {
      const token = await funcs.login('marie.leclerc.Schood1@schood.fr', 'Marie_123')

      funcs.setToken(token)

      await funcs.post(`/shared/moods/userSeen/${funcs.wrongId}`, {}, 422)
    })

    it('POST /shared/moods/userSeen/:id => Try mood seen bad id', async () => {
      const token = await funcs.login('marie.leclerc.Schood1@schood.fr', 'Marie_123')

      funcs.setToken(token)

      await funcs.post('/shared/moods/userSeen/test', {}, 400)
    })
  })
})
