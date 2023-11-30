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

  describe('Register route', () => {
    it('POST /adm/helpNumbersCategory/register => Try register good request', async () => {
      let key

      await request(app)
        .post('/user/login')
        .send({
          email: 'admin@schood.fr',
          password: 'admin123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })
      return await request(app)
        .post('/adm/helpNumbersCategory/register')
        .set({
          'x-auth-token': key
        })
        .send({
          name: 'test'
        })
        .expect(200)
    })

    it('POST /adm/helpNumbersCategory/register => Try register bad request', async () => {
      let key

      await request(app)
        .post('/user/login')
        .send({
          email: 'admin@schood.fr',
          password: 'admin123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })
      return await request(app)
        .post('/adm/helpNumbersCategory/register')
        .set({
          'x-auth-token': key
        })
        .send({
        })
        .expect(400)
    })

    it('POST /adm/helpNumbersCategory/register => Try register name already used', async () => {
      let key

      await request(app)
        .post('/user/login')
        .send({
          email: 'admin@schood.fr',
          password: 'admin123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })

      await request(app)
        .post('/adm/helpNumbersCategory/register')
        .set({
          'x-auth-token': key
        })
        .send({
          name: 'test'
        })
        .expect(200)

      return await request(app)
        .post('/adm/helpNumbersCategory/register')
        .set({
          'x-auth-token': key
        })
        .send({
          name: 'test'
        })
        .expect(422)
    })
  })
})
