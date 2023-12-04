const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')
const { Users } = require('../../../../models/users')

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

  describe('createChat route', () => {
    it('POST /user/chat => Try create chat good ids', async () => {
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

      return await request(app)
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
    })

    it('POST /user/chat => Try create chat bad ids', async () => {
      let key

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

      return await request(app)
        .post('/user/chat')
        .set({
          'x-auth-token': key
        })
        .send({
          participants: [
            '64692acf1874cb0532aa619d'
          ]
        })
        .expect('Content-Type', /json/)
        .expect(422)
    })

    it('POST /user/chat => Try create chat no ids', async () => {
      let key

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

      return await request(app)
        .post('/user/chat')
        .set({
          'x-auth-token': key
        })
        .send({
          participants: [
          ]
        })
        .expect('Content-Type', /json/)
        .expect(400)
    })
  })
})
