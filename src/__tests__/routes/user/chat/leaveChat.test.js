const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')
const TestFunctions = require('../../../serverUtils/TestFunctions')
const { Chats } = require('../../../../models/chat')

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

  describe('createChat route', () => {
    it('POST /user/chat => Try leave chat', async () => {
      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      const user1 = await funcs.getUser({ email: 'jacqueline.delais.Schood1@schood.fr' })
      const user2 = await funcs.getUser({ email: 'pierre.dubois.Schood1@schood.fr' })
      const user3 = await funcs.getUser({ email: 'alice.johnson.Schood1@schood.fr' })
      const body = {
        title: "test",
        participants: [
          user1._id,
          user2._id,
          user3._id
        ]
      }

      funcs.setToken(token)
      await funcs.post('/user/chat', body)
      let chat = await Chats.findOne({title: "test"})
      expect(chat.participants.length).toEqual(3)

      await funcs.post(`/user/chat/${chat._id}/leave`)
      chat = await Chats.findOne({title: "test"})
      expect(chat.participants.length).toEqual(2)
    })

    it('POST /user/chat => Try leave chat last user', async () => {
      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      const user1 = await funcs.getUser({ email: 'jacqueline.delais.Schood1@schood.fr' })
      const user2 = await funcs.getUser({ email: 'pierre.dubois.Schood1@schood.fr' })
      const body = {
        title: "test", 
        participants: [
          user1._id,
          user2._id
        ]
      }

      funcs.setToken(token)
      await funcs.post('/user/chat', body)
      let chat = await Chats.findOne({title: "test"})
      expect(chat.participants.length).toEqual(2)

      await funcs.post(`/user/chat/${chat._id}/leave`)
      chat = await funcs.getChat({ _id: chat._id })
      expect(chat).toBeNull()
    })

    it('POST /user/chat => Try leave chat bad user', async () => {
      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      const user1 = await funcs.getUser({ email: 'jacqueline.delais.Schood1@schood.fr' })
      const user2 = await funcs.getUser({ email: 'pierre.dubois.Schood1@schood.fr' })
      const body = {
        title: "test",
        participants: [
          user1._id,
          user2._id
        ]
      }

      funcs.setToken(token)
      await funcs.post('/user/chat', body)
      let chat = await Chats.findOne({title: "test"})
      expect(chat.participants.length).toEqual(2)

      await funcs.post(`/user/chat/${chat._id}/leave`, {}, 422, null, await funcs.login('alice.johnson.Schood1@schood.fr', 'Alice_123'))
      chat = await funcs.getChat({ _id: chat._id })
      expect(chat.participants.length).toEqual(2)
    })

    it('POST /user/chat => Try leave chat bad id', async () => {
      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      funcs.setToken(token)
      await funcs.post('/user/chat/64692acf1874cb0532aa619d/leave', {}, 400)
    })

    it('POST /user/chat => Try leave chat bad id2', async () => {
      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      funcs.setToken(token)
      await funcs.post('/user/chat/test/leave', {}, 400)
    })
  })
})
