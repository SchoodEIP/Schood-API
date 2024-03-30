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

  describe('getAllHelpNumbersCategories route', () => {
    it('GET /user/helpNumbersCategories/:id => Try get help numbers categories', async () => {
      let key

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

      return await request(app)
        .get('/user/helpNumbersCategories')
        .set({
          'x-auth-token': key
        })
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })
})
