const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../serverUtils/testServer')
const dbDefault = require('../../../config/db.default')

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

  describe('Profile route', () => {
    it('GET /user/profile => Try good email', async () => {
        let key
  
        await request(app)
          .post('/user/login')
          .send({
            email: 'student1@schood.fr',
            password: 'student123'
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => {
            key = response.body.token
          })
      return await request(app)
        .get('/user/profile')
        .set({
            'x-auth-token': key
        })
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })
})
