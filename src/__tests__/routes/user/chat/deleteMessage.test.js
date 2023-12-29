const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')
const { Chats } = require('../../../../models/chat')
const TestFunctions = require('../../../serverUtils/TestFunctions')
const { Messages } = require('../../../../models/message')

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
    await dbDefault()
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
  })

  describe('deleteMessage route', () => {
    it('POST /user/chat/:id/messages/:messageId => Try delete message', async () => {
      const token = await funcs.login('adm@schood.fr', 'adm123')
      const participants = {
        participants: [
          (await funcs.getUser({ email: 'adm@schood.fr' }))._id,
          (await funcs.getUser({ email: 'teacher1@schood.fr' }))._id
        ]
      }
      const body = {
        content: 'Test'
      }

      funcs.setToken(token)
      await funcs.post('/user/chat', participants)

      const chat = (await Chats.find({}))[0]
      await funcs.post(`/user/chat/${chat._id}/newMessage`, body)

      const message = (await Messages.find({}))[0]
      await funcs.delete(`/user/chat/${chat._id}/messages/${message._id}`)
      expect(await funcs.getMessage({ _id: message._id })).toBeNull()
      expect((await funcs.getChat({ _id: chat._id })).messages.length).toEqual(0)
    })

    it('POST /user/chat/:id/messages/:messageId => Try delete message bad user', async () => {
      const token = await funcs.login('adm@schood.fr', 'adm123')
      const participants = {
        participants: [
          (await funcs.getUser({ email: 'adm@schood.fr' }))._id,
          (await funcs.getUser({ email: 'teacher1@schood.fr' }))._id
        ]
      }
      const body = {
        content: 'Test'
      }

      funcs.setToken(token)
      await funcs.post('/user/chat', participants)

      const chat = (await Chats.find({}))[0]
      await funcs.post(`/user/chat/${chat._id}/newMessage`, body)

      const message = (await Messages.find({}))[0]
      await funcs.delete(`/user/chat/${chat._id}/messages/${message._id}`, 401, /json/, await funcs.login('teacher1@schood.fr', 'teacher123'))
    })

    it('POST /user/chat/:id/messages/:messageId => Try delete message bad id', async () => {
      const token = await funcs.login('adm@schood.fr', 'adm123')
      const participants = {
        participants: [
          (await funcs.getUser({ email: 'adm@schood.fr' }))._id,
          (await funcs.getUser({ email: 'teacher1@schood.fr' }))._id
        ]
      }
      const body = {
        content: 'Test'
      }

      funcs.setToken(token)
      await funcs.post('/user/chat', participants)

      const chat = (await Chats.find({}))[0]
      await funcs.post(`/user/chat/${chat._id}/newMessage`, body)

      const message = (await Messages.find({}))[0]
      await funcs.delete(`/user/chat/64692acf1874cb0532aa619d/messages/${message._id}`, 400, /json/)
    })

    it('POST /user/chat/:id/messages/:messageId => Try delete message bad messageId', async () => {
      const token = await funcs.login('adm@schood.fr', 'adm123')
      const participants = {
        participants: [
          (await funcs.getUser({ email: 'adm@schood.fr' }))._id,
          (await funcs.getUser({ email: 'teacher1@schood.fr' }))._id
        ]
      }
      const body = {
        content: 'Test'
      }

      funcs.setToken(token)
      await funcs.post('/user/chat', participants)

      const chat = (await Chats.find({}))[0]
      await funcs.post(`/user/chat/${chat._id}/newMessage`, body)

      await funcs.delete(`/user/chat/${chat._id}/messages/64692acf1874cb0532aa619d`, 400, /json/)
    })
  })
})
