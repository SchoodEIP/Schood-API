const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')
const { Users } = require('../../../../models/users')
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
    it('POST /user/chat => Try add participant', async () => {
      const token = await funcs.login('admin.Schood1@schood.fr', 'admin_123')
      const userAdm = await Users.findOne({ email: 'admin.Schood1@schood.fr' })
      const user1 = await Users.findOne({ email: 'jacqueline.delais.Schood1@schood.fr' })
      const user2 = await Users.findOne({ email: 'pierre.dubois.Schood1@schood.fr' })

      funcs.setToken(token)
      await funcs.post('/user/chat', {
        title: 'test',
        participants: [userAdm._id, user1._id]
      })

      let chat = await Chats.findOne({ title: 'test' })
      expect(chat.participants.length).toEqual(2)

      await funcs.post(`/user/chat/${chat._id}/addParticipants`, { participants: [user2._id] })
      chat = await funcs.getChat({ _id: chat._id })
      expect(chat.participants.length).toEqual(3)
    })

    it('POST /user/chat => Try add multiple participants', async () => {
      const token = await funcs.login('admin.Schood1@schood.fr', 'admin_123')
      const userAdm = await Users.findOne({ email: 'admin.Schood1@schood.fr' })
      const user1 = await Users.findOne({ email: 'jacqueline.delais.Schood1@schood.fr' })
      const user2 = await Users.findOne({ email: 'pierre.dubois.Schood1@schood.fr' })
      const user3 = await Users.findOne({ email: 'alice.johnson.Schood1@schood.fr' })

      funcs.setToken(token)
      await funcs.post('/user/chat', {
        title: 'test',
        participants: [userAdm._id, user1._id]
      })

      let chat = await Chats.findOne({ title: 'test' })
      expect(chat.participants.length).toEqual(2)

      await funcs.post(`/user/chat/${chat._id}/addParticipants`, { participants: [user2._id, user3._id] })
      chat = await funcs.getChat({ _id: chat._id })
      expect(chat.participants.length).toEqual(4)
    })

    it('POST /user/chat => Try add participant bad ids', async () => {
      const userAdm = await Users.findOne({ email: 'admin.Schood1@schood.fr' })
      const token = await funcs.login('admin.Schood1@schood.fr', 'admin_123')
      const user1 = await Users.findOne({ email: 'jacqueline.delais.Schood1@schood.fr' })

      funcs.setToken(token)
      await funcs.post('/user/chat', {
        title: 'test',
        participants: [userAdm._id, user1._id]
      })

      let chat = await Chats.findOne({ title: 'test' })
      expect(chat.participants.length).toEqual(2)

      await funcs.post(`/user/chat/${chat._id}/addParticipants`, { participants: ['64692acf1874cb0532aa619d'] }, 422)
      chat = await funcs.getChat({ _id: chat._id })
      expect(chat.participants.length).toEqual(2)
    })

    it('POST /user/chat => Try add participant no ids', async () => {
      const userAdm = await Users.findOne({ email: 'admin.Schood1@schood.fr' })
      const token = await funcs.login('admin.Schood1@schood.fr', 'admin_123')
      const user1 = await Users.findOne({ email: 'jacqueline.delais.Schood1@schood.fr' })

      funcs.setToken(token)
      await funcs.post('/user/chat', {
        title: 'test',
        participants: [userAdm._id, user1._id]
      })

      let chat = await Chats.findOne({ title: 'test' })
      expect(chat.participants.length).toEqual(2)

      await funcs.post(`/user/chat/${chat._id}/addParticipants`, { participants: [] }, 400)
      chat = await funcs.getChat({ _id: chat._id })
      expect(chat.participants.length).toEqual(2)
    })

    it('POST /user/chat => Try add participant already exists', async () => {
      const token = await funcs.login('admin.Schood1@schood.fr', 'admin_123')
      const userAdm = await Users.findOne({ email: 'admin.Schood1@schood.fr' })
      const user1 = await Users.findOne({ email: 'jacqueline.delais.Schood1@schood.fr' })
      const body = {
        title: 'test',
        participants: [userAdm._id, user1._id]
      }

      funcs.setToken(token)
      await funcs.post('/user/chat', body)

      let chat = await Chats.findOne({ title: 'test' })
      expect(chat.participants.length).toEqual(2)

      await funcs.post(`/user/chat/${chat._id}/addParticipants`, { participants: [user1._id] }, 422)
      chat = await funcs.getChat({ _id: chat._id })
      expect(chat.participants.length).toEqual(2)
    })

    it('POST /user/chat => Try add participant bad id', async () => {
      const token = await funcs.login('admin.Schood1@schood.fr', 'admin_123')
      funcs.setToken(token)
      await funcs.post('/user/chat/test/addParticipants', {}, 400)
    })

    it('POST /user/chat => Try add participant chat not exist', async () => {
      const token = await funcs.login('admin.Schood1@schood.fr', 'admin_123')
      funcs.setToken(token)
      await funcs.post('/user/chat/65db3e48f5d74add96fd5709/addParticipants', {}, 400)
    })

    it('POST /user/chat => Try add participant user not in chat', async () => {
      const token = await funcs.login('admin.Schood1@schood.fr', 'admin_123')
      const user1 = await Users.findOne({ email: 'jacqueline.delais.Schood1@schood.fr' })
      const user2 = await Users.findOne({ email: 'pierre.dubois.Schood1@schood.fr' })

      funcs.setToken(token)
      await funcs.post('/user/chat', {
        title: 'test',
        participants: [user1._id]
      })

      const chat = await Chats.findOne({ title: 'test' })
      expect(chat.participants.length).toEqual(1)

      await funcs.post(`/user/chat/${chat._id}/addParticipants`, { participants: [user2._id] }, 400)
    })
  })
})
