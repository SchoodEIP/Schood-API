const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')
const { Users } = require('../../../../models/users')
const { Chats } = require('../../../../models/chat')

describe('User route tests', () => {
  let app

  beforeAll(async () => {
    process.env.PROD = true
    app = await server.testServer()
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

  describe('newMessage route', () => {
    it('POST /user/chat/:id/newMessage => Try new message', async () => {
      let key
      const user1 = await Users.findOne({ email: 'adm@schood.fr' })
      const user2 = await Users.findOne({ email: 'teacher1@schood.fr' })

      await request(app)
        .post('/user/login')
        .send({
          email: 'adm@schood.fr',
          password: 'adm123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })

      await request(app)
        .post('/user/chat')
        .set({
          'x-auth-token': key
        })
        .send({
          participants: [
            user1._id,
            user2._id
          ]
        })
        .expect(200)

      const chat = (await Chats.find({}))[0]

      return await request(app)
        .post(`/user/chat/${chat._id}/newMessage`)
        .set({
          'x-auth-token': key
        })
        .send({
          content: 'Test'
        })
        .expect(200)
    })

    it('POST /user/chat/:id/newMessage => Try new message bad id', async () => {
      let key
      const user1 = await Users.findOne({ email: 'adm@schood.fr' })
      const user2 = await Users.findOne({ email: 'teacher1@schood.fr' })

      await request(app)
        .post('/user/login')
        .send({
          email: 'adm@schood.fr',
          password: 'adm123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })

      await request(app)
        .post('/user/chat')
        .set({
          'x-auth-token': key
        })
        .send({
          participants: [
            user1._id,
            user2._id
          ]
        })
        .expect(200)

      return await request(app)
        .post('/user/chat/64692acf1874cb0532aa619d/newMessage')
        .set({
          'x-auth-token': key
        })
        .send({
          content: 'Test'
        })
        .expect(400)
    })

    it('POST /user/chat/:id/newMessage => Try new message bad content', async () => {
      let key
      const user1 = await Users.findOne({ email: 'adm@schood.fr' })
      const user2 = await Users.findOne({ email: 'teacher1@schood.fr' })

      await request(app)
        .post('/user/login')
        .send({
          email: 'adm@schood.fr',
          password: 'adm123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })

      await request(app)
        .post('/user/chat')
        .set({
          'x-auth-token': key
        })
        .send({
          participants: [
            user1._id,
            user2._id
          ]
        })
        .expect(200)

      const chat = (await Chats.find({}))[0]

      return await request(app)
        .post(`/user/chat/${chat._id}/newMessage`)
        .set({
          'x-auth-token': key
        })
        .send({
          content: ''
        })
        .expect(400)
    })

    it('POST /user/chat/:id/newMessage => Try new message bad params', async () => {
      let key
      const user1 = await Users.findOne({ email: 'adm@schood.fr' })
      const user2 = await Users.findOne({ email: 'teacher1@schood.fr' })

      await request(app)
        .post('/user/login')
        .send({
          email: 'adm@schood.fr',
          password: 'adm123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })

      await request(app)
        .post('/user/chat')
        .set({
          'x-auth-token': key
        })
        .send({
          participants: [
            user1._id,
            user2._id
          ]
        })
        .expect(200)

      const chat = (await Chats.find({}))[0]

      return await request(app)
        .post(`/user/chat/${chat._id}/newMessage`)
        .set({
          'x-auth-token': key
        })
        .send({
        })
        .expect(400)
    })

    it('POST /user/chat/:id/newMessage => Try new message, bad user', async () => {
      let key
      const user1 = await Users.findOne({ email: 'admin@schood.fr' })
      const user2 = await Users.findOne({ email: 'teacher1@schood.fr' })

      await request(app)
        .post('/user/login')
        .send({
          email: 'adm@schood.fr',
          password: 'adm123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })

      await request(app)
        .post('/user/chat')
        .set({
          'x-auth-token': key
        })
        .send({
          participants: [
            user1._id,
            user2._id
          ]
        })
        .expect(200)

      const chat = (await Chats.find({}))[0]

      await request(app)
        .post('/user/login')
        .send({
          email: 'teacher2@schood.fr',
          password: 'teacher123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })

      return await request(app)
        .post(`/user/chat/${chat._id}/newMessage`)
        .set({
          'x-auth-token': key
        })
        .send({
          content: 'Test'
        })
        .expect(422)
    })
  })
})
