const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')

describe('Student dailyMood route tests', () => {
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

  describe('dailyMood route', () => {
    it('GET /student/dailyMood/ => Try get dailyMood', async () => {
      let key

        await request(app)
            .post('/user/login')
            .send({
              email: 'alice.johnson.Schood1@schood.fr',
              password: 'Alice_123'
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
              key = response.body.token
            })
        await request(app)
            .get('/student/dailyMood/')
            .set({
              'x-auth-token': key
            })
            .expect('Content-Type', /json/)
            .expect(200)
    })
  })
})
