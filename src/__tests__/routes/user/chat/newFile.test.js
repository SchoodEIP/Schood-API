const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')
const { Users } = require('../../../../models/users')
const { Chats } = require('../../../../models/chat')

describe('User route tests', () => {
  let app

  beforeAll(async () => {
    process.env.PROD = false
    app = await server.testServer()
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

  describe('newFile route', () => {
    it('POST /user/chat/:id/newFile => Try new file', async () => {
      let key
      const user1 = await Users.findOne({ email: 'jacqueline.delais.Schood1@schood.fr' })
      const user2 = await Users.findOne({ email: 'pierre.dubois.Schood1@schood.fr' })

      await request(app)
        .post('/user/login')
        .send({
          email: 'jacqueline.delais.Schood1@schood.fr',
          password: 'Jacqueline_123'
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
          title: "test",
          participants: [
            user1._id,
            user2._id
          ]
        })
        .expect(200)

      const chat = await Chats.findOne({title: "test"})

      return await request(app)
        .post(`/user/chat/${chat._id}/newFile`)
        .set({
          'x-auth-token': key
        })
        .attach('file', '__tests__/fixtures/adm/csvRegisterUser/correct.csv')
        .field('content', 'Test')
        .expect(200)
    })

    it('POST /user/chat/:id/newFile => Try new file bad id', async () => {
      let key
      const user1 = await Users.findOne({ email: 'jacqueline.delais.Schood1@schood.fr' })
      const user2 = await Users.findOne({ email: 'pierre.dubois.Schood1@schood.fr' })

      await request(app)
        .post('/user/login')
        .send({
          email: 'jacqueline.delais.Schood1@schood.fr',
          password: 'Jacqueline_123'
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
        .post('/user/chat/64692acf1874cb0532aa619d/newFile')
        .set({
          'x-auth-token': key
        })
        .attach('file', '__tests__/fixtures/adm/csvRegisterUser/correct.csv')
        .field('content', 'Test')
        .expect(400)
    })

    it('POST /user/chat/:id/newFile => Try new file no content', async () => {
      let key
      const user1 = await Users.findOne({ email: 'jacqueline.delais.Schood1@schood.fr' })
      const user2 = await Users.findOne({ email: 'pierre.dubois.Schood1@schood.fr' })

      await request(app)
        .post('/user/login')
        .send({
          email: 'jacqueline.delais.Schood1@schood.fr',
          password: 'Jacqueline_123'
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
          title: "test",
          participants: [
            user1._id,
            user2._id
          ]
        })
        .expect(200)

      const chat = await Chats.findOne({title: "test"})

      return await request(app)
        .post(`/user/chat/${chat._id}/newFile`)
        .set({
          'x-auth-token': key
        })
        .field('content', '')
        .attach('file', '__tests__/fixtures/adm/csvRegisterUser/correct.csv')
        .expect(200)
    })

    it('POST /user/chat/:id/newFile => Try new file bad params', async () => {
      let key
      const user1 = await Users.findOne({ email: 'jacqueline.delais.Schood1@schood.fr' })
      const user2 = await Users.findOne({ email: 'pierre.dubois.Schood1@schood.fr' })

      await request(app)
        .post('/user/login')
        .send({
          email: 'jacqueline.delais.Schood1@schood.fr',
          password: 'Jacqueline_123'
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
        .post(`/user/chat/${chat._id}/newFile`)
        .set({
          'x-auth-token': key
        })
        .attach('file', '')
        .expect(400)
    })

    it('POST /user/chat/:id/newFile => Try new file, bad user', async () => {
      let key
      const user1 = await Users.findOne({ email: 'admin.Schood1@schood.fr' })
      const user2 = await Users.findOne({ email: 'pierre.dubois.Schood1@schood.fr' })

      await request(app)
        .post('/user/login')
        .send({
          email: 'jacqueline.delais.Schood1@schood.fr',
          password: 'Jacqueline_123'
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
          title: "test",
          participants: [
            user1._id,
            user2._id
          ]
        })
        .expect(200)

      const chat = await Chats.findOne({title: "test"})

      await request(app)
        .post('/user/login')
        .send({
          email: 'marie.leclerc.Schood1@schood.fr',
          password: 'Marie_123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })

      return await request(app)
        .post(`/user/chat/${chat._id}/newFile`)
        .set({
          'x-auth-token': key
        })
        .attach('file', '__tests__/fixtures/adm/csvRegisterUser/correct.csv')
        .field('content', 'Test')
        .expect(422)
    })
  })
})
