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

  describe('forgottenPassword route', () => {
    it('POST /user/forgottenPassword => Try good email', async () => {
      return await request(app)
        .post('/user/forgottenPassword/?mail=false')
        .send({
          email: 'student1@schood.fr'
        })
        .expect(200)
    })

    it('POST /user/forgottenPassword => Try bad email', async () => {
      return await request(app)
        .post('/user/forgottenPassword/?mail=false')
        .send({
          email: 'test@test.fr'
        })
        .expect(200)
    })

    it('POST /user/forgottenPassword => Try no email', async () => {
      return await request(app)
        .post('/user/forgottenPassword/?mail=false')
        .expect(400)
    })
  })
})
