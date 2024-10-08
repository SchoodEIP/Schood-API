const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')

describe('Adm route tests', () => {
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

  describe('classes getAllClasses route', () => {
    it('GET /shared/classes/ => Try get all class', async () => {
      let key

      await request(app)
        .post('/user/login')
        .send({
          email: 'admin.Schood1@schood.fr',
          password: 'admin_123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })
      return await request(app)
        .get('/shared/classes/')
        .set({
          'x-auth-token': key
        })
        .expect(200)
        .expect('Content-Type', /json/)
    })
  })
})
