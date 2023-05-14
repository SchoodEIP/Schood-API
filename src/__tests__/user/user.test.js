const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../serverUtils/testServer')
const dbDefault = require('../../config/db.default')

describe('User route tests', () => {
  let app

  beforeAll(async () => {
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

  describe('Login route', () => {
    it('POST /user/login => Try good login', async () => {
      return await request(app)
        .post('/user/login')
        .send({
          email: 'admin@schood.fr',
          password: 'admin123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
    })

    it('POST /user/login => Try bad username', async () => {
      return await request(app)
        .post('/user/login')
        .send({
          email: 'test',
          password: 'admin123'
        })
        .expect(400)
    })

    it('POST /user/login => Try bad password', async () => {
      return await request(app)
        .post('/user/login')
        .send({
          email: 'admin',
          password: 'test'
        })
        .expect(400)
    })

    it('POST /user/login => Try bad form', async () => {
      return await request(app)
        .post('/user/login')
        .send({
          email: 'test'
        })
        .expect(400)
    })
  })
})
