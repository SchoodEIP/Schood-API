const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')
const { Roles } = require('../../../../models/roles')

describe('Adm route tests', () => {
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

  describe('Register route', () => {
    it('POST /adm/class/register => Try register good class', async () => {
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
        .post('/adm/class/register')
        .set({
          'x-auth-token': key
        })
        .send({
          name: 'test'
        })
        .expect(200)
    })

    it('POST /adm/class/register => Try register wrong class, name already used', async () => {
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
        .post('/adm/class/register')
        .set({
          'x-auth-token': key
        })
        .send({
          name: 'test'
        })
        .expect(200)

      return await request(app)
        .post('/adm/class/register')
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
