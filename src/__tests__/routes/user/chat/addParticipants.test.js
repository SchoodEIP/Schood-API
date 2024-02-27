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
      const token = await funcs.login('admin@schood.fr', 'admin123')
      const user1 = await Users.findOne({ email: 'adm@schood.fr' })
      const user2 = await Users.findOne({ email: 'teacher1@schood.fr' })

      funcs.setToken(token)
      await funcs.post('/user/chat', { participants: [user1._id] })

      let chat = (await Chats.find({}))[0]
      expect(chat.participants.length).toEqual(2)

      await funcs.post(`/user/chat/${chat._id}/addParticipants`, { participants: [user2._id] })
      chat = await funcs.getChat({ _id: chat._id })
      expect(chat.participants.length).toEqual(3)
    })

    it('POST /user/chat => Try add multiple participants', async () => {
      const token = await funcs.login('admin@schood.fr', 'admin123')
      const user1 = await Users.findOne({ email: 'adm@schood.fr' })
      const user2 = await Users.findOne({ email: 'teacher1@schood.fr' })
      const user3 = await Users.findOne({ email: 'student1@schood.fr' })

      funcs.setToken(token)
      await funcs.post('/user/chat', { participants: [user1._id] })

      let chat = (await Chats.find({}))[0]
      expect(chat.participants.length).toEqual(2)

      await funcs.post(`/user/chat/${chat._id}/addParticipants`, { participants: [user2._id, user3._id] })
      chat = await funcs.getChat({ _id: chat._id })
      expect(chat.participants.length).toEqual(4)
    })

    it('POST /user/chat => Try add participant bad ids', async () => {
      const token = await funcs.login('admin@schood.fr', 'admin123')
      const user1 = await Users.findOne({ email: 'adm@schood.fr' })

      funcs.setToken(token)
      await funcs.post('/user/chat', { participants: [user1._id] })

      let chat = (await Chats.find({}))[0]
      expect(chat.participants.length).toEqual(2)

      await funcs.post(`/user/chat/${chat._id}/addParticipants`, { participants: ['64692acf1874cb0532aa619d'] }, 422)
      chat = await funcs.getChat({ _id: chat._id })
      expect(chat.participants.length).toEqual(2)
    })

    it('POST /user/chat => Try add participant no ids', async () => {
      const token = await funcs.login('admin@schood.fr', 'admin123')
      const user1 = await Users.findOne({ email: 'adm@schood.fr' })

      funcs.setToken(token)
      await funcs.post('/user/chat', { participants: [user1._id] })

      let chat = (await Chats.find({}))[0]
      expect(chat.participants.length).toEqual(2)

      await funcs.post(`/user/chat/${chat._id}/addParticipants`, { participants: [] }, 400)
      chat = await funcs.getChat({ _id: chat._id })
      expect(chat.participants.length).toEqual(2)
    })

    it('POST /user/chat => Try add participant already exists', async () => {
      const token = await funcs.login('admin@schood.fr', 'admin123')
      const user1 = await Users.findOne({ email: 'adm@schood.fr' })
      const body = { participants: [user1._id] }

      funcs.setToken(token)
      await funcs.post('/user/chat', body)

      let chat = (await Chats.find({}))[0]
      expect(chat.participants.length).toEqual(2)

      await funcs.post(`/user/chat/${chat._id}/addParticipants`, body, 422)
      chat = await funcs.getChat({ _id: chat._id })
      expect(chat.participants.length).toEqual(2)
    })
  })
})
