const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')
const { Roles } = require('../../../../models/roles')

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

  describe('getAvailableChatUsers route', () => {
    it('GET /user/chat/users => Try get users from student account', async () => {
      let key

      await request(app)
        .post('/user/login')
        .send({
          email: 'jean-pierre.lefevre.Schood1@schood.fr',
          password: 'Jean-Pierre_123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })

      return await request(app)
        .get('/user/chat/users')
        .set({
          'x-auth-token': key
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          const studentRole = Roles.findOne({ levelOfAccess: 0 })
          for (const item of response.body) {
            expect(item.role === studentRole._id).toBe(false)
          }
        })
    })

    it('GET /user/chat/users => Try get users from student account', async () => {
      let key

      await request(app)
        .post('/user/login')
        .send({
          email: 'pierre.dubois.Schood1@schood.fr',
          password: 'Pierre_123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })

      return await request(app)
        .get('/user/chat/users')
        .set({
          'x-auth-token': key
        })
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })
})
