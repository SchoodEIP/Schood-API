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
    await dbDefault(true)
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
  })

  describe('newMessage route', () => {
    it('PATCH /user/chat/messages/:id => Try update message', async () => {
      const token = await funcs.login('adm@schood.fr', 'adm123')
      const chatBody = {
        participants: [
          (await funcs.getUser({ email: 'adm@schood.fr' }))._id,
          (await funcs.getUser({ email: 'teacher1@schood.fr' }))._id
        ]
      }
      const messageBody = { content: 'test' }

      funcs.setToken(token)
      await funcs.post('/user/chat', chatBody)

      const chat = (await Chats.find({}))[0]

      await funcs.post(`/user/chat/${chat._id}/newMessage`, messageBody)

      let message = (await Messages.find({}))[0]
      expect(message.content).toEqual('test')
      messageBody.content = 'No test'
      await funcs.patch(`/user/chat/messages/${message._id}`, messageBody)

      message = (await Messages.find({}))[0]
      expect(message.content).toEqual('No test')
    })

    it('PATCH /user/chat/messages/:id => Try update message bad id', async () => {
      const token = await funcs.login('adm@schood.fr', 'adm123')
      const chatBody = {
        participants: [
          (await funcs.getUser({ email: 'adm@schood.fr' }))._id,
          (await funcs.getUser({ email: 'teacher1@schood.fr' }))._id
        ]
      }
      const messageBody = { content: 'test' }

      funcs.setToken(token)
      await funcs.post('/user/chat', chatBody)

      const chat = (await Chats.find({}))[0]

      await funcs.post(`/user/chat/${chat._id}/newMessage`, messageBody)

      let message = (await Messages.find({}))[0]
      expect(message.content).toEqual('test')
      messageBody.content = 'No test'
      await funcs.patch('/user/chat/messages/64692acf1874cb0532aa619d', messageBody, 400)

      message = (await Messages.find({}))[0]
      expect(message.content).toEqual('test')
    })

    it('PATCH /user/chat/messages/:id => Try update message bad content', async () => {
      const token = await funcs.login('adm@schood.fr', 'adm123')
      const chatBody = {
        participants: [
          (await funcs.getUser({ email: 'adm@schood.fr' }))._id,
          (await funcs.getUser({ email: 'teacher1@schood.fr' }))._id
        ]
      }
      const messageBody = { content: 'test' }

      funcs.setToken(token)
      await funcs.post('/user/chat', chatBody)

      const chat = (await Chats.find({}))[0]

      await funcs.post(`/user/chat/${chat._id}/newMessage`, messageBody)

      let message = (await Messages.find({}))[0]
      expect(message.content).toEqual('test')
      messageBody.content = ''
      await funcs.patch(`/user/chat/messages/${message._id}`, messageBody, 400)

      message = (await Messages.find({}))[0]
      expect(message.content).toEqual('test')
    })

    it('PATCH /user/chat/messages/:id => Try update message bad user', async () => {
      const token = await funcs.login('adm@schood.fr', 'adm123')
      const chatBody = {
        participants: [
          (await funcs.getUser({ email: 'adm@schood.fr' }))._id,
          (await funcs.getUser({ email: 'teacher1@schood.fr' }))._id
        ]
      }
      const messageBody = { content: 'test' }

      funcs.setToken(token)
      await funcs.post('/user/chat', chatBody)

      const chat = (await Chats.find({}))[0]

      await funcs.post(`/user/chat/${chat._id}/newMessage`, messageBody)

      let message = (await Messages.find({}))[0]
      expect(message.content).toEqual('test')
      messageBody.content = ''
      await funcs.patch(`/user/chat/messages/${message._id}`, messageBody, 401, null, await funcs.login('admin@schood.fr', 'admin123'))

      message = (await Messages.find({}))[0]
      expect(message.content).toEqual('test')
    })

    it('PATCH /user/chat/messages/:id => Try update message bad params', async () => {
      const token = await funcs.login('adm@schood.fr', 'adm123')
      const chatBody = {
        participants: [
          (await funcs.getUser({ email: 'adm@schood.fr' }))._id,
          (await funcs.getUser({ email: 'teacher1@schood.fr' }))._id
        ]
      }
      const messageBody = { content: 'test' }

      funcs.setToken(token)
      await funcs.post('/user/chat', chatBody)

      const chat = (await Chats.find({}))[0]

      await funcs.post(`/user/chat/${chat._id}/newMessage`, messageBody)

      let message = (await Messages.find({}))[0]
      expect(message.content).toEqual('test')
      await funcs.patch(`/user/chat/messages/${message._id}`, {}, 400)

      message = (await Messages.find({}))[0]
      expect(message.content).toEqual('test')
    })
  })
})
