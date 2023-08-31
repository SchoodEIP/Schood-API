const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../serverUtils/testServer')
const dbDefault = require('../../../config/db.default')
const { Chats } = require('../../../models/chat')
const { Users } = require('../../../models/users')

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

  describe('downloadFile route', () => {
    it('POST /user/downloadFile => Try good id', async () => {
      let key
      let id
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

      await request(app)
        .post(`/user/chat/${chat._id}/newFile`)
        .set({
          'x-auth-token': key
        })
        .attach('file', '__tests__/fixtures/adm/csvRegisterUser/correct.csv')
        .field('content', 'Test')
        .expect(200)

      await request(app)
        .get(`/user/chat/${chat._id}/messages`)
        .set({
          'x-auth-token': key
        })
        .expect(200)
        .then(response => {
          id = response.body[0].file
        })

      return await request(app)
        .get(`/user/file/${id}`)
        .set({
          'x-auth-token': key
        })
        .expect(200)
    })

    it('POST /user/forgottenPassword => Try bad id', async () => {
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

      await request(app)
        .post(`/user/chat/${chat._id}/newFile`)
        .set({
          'x-auth-token': key
        })
        .attach('file', '__tests__/fixtures/adm/csvRegisterUser/correct.csv')
        .field('content', 'Test')
        .expect(200)

      return await request(app)
        .get('/user/file/64692acf1874cb0532aa619d')
        .set({
          'x-auth-token': key
        })
        .expect(400)
    })
  })
})
