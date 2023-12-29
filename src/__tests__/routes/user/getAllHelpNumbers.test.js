const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../serverUtils/testServer')
const dbDefault = require('../../../config/db.default')

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

  describe('getAllHelpNumbers route', () => {
    it('GET /user/helpNumbers => Try get all help numbers', async () => {
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
        .get('/user/helpNumbers')
        .set({
          'x-auth-token': key
        })
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })
})
