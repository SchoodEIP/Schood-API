const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')
const { HelpNumbersCategories } = require('../../../../models/helpNumbersCategories')

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
    it('POST /adm/helpNumber/register => Try register good request', async () => {
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
          name: 'testCategory'
        })
        .expect(200)

      const helpNumbersCategory = await HelpNumbersCategories.findOne({ name: 'testCategory' })

      return await request(app)
        .post('/adm/helpNumber/register')
        .set({
          'x-auth-token': key
        })
        .send({
          name: 'test',
          telephone: '0102030405',
          email: 'test.mail@gmail.com',
          helpNumbersCategory: helpNumbersCategory._id
        })
        .expect(200)
    })

    it('POST /adm/helpNumber/register => Try register bad request', async () => {
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
          name: 'testCategory'
        })
        .expect(200)

      return await request(app)
        .post('/adm/helpNumber/register')
        .set({
          'x-auth-token': key
        })
        .send({
        })
        .expect(400)
    })

    it('POST /adm/helpNumber/register => Try register name already used', async () => {
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
          name: 'testCategory'
        })
        .expect(200)

      const helpNumbersCategory = await HelpNumbersCategories.findOne({ name: 'testCategory' })

      await request(app)
        .post('/adm/helpNumber/register')
        .set({
          'x-auth-token': key
        })
        .send({
          name: 'test',
          telephone: '0102030405',
          email: 'test.mail@gmail.com',
          helpNumbersCategory: helpNumbersCategory._id
        })
        .expect(200)

      return await request(app)
        .post('/adm/helpNumber/register')
        .set({
          'x-auth-token': key
        })
        .send({
          name: 'test',
          telephone: '0102030405',
          email: 'test.mail@gmail.com',
          helpNumbersCategory: helpNumbersCategory._id
        })
        .expect(422)
    })

    it('POST /adm/helpNumber/register => Try register no email and no telephone', async () => {
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
          name: 'testCategory'
        })
        .expect(200)

      const helpNumbersCategory = await HelpNumbersCategories.findOne({ name: 'testCategory' })

      return await request(app)
        .post('/adm/helpNumber/register')
        .set({
          'x-auth-token': key
        })
        .send({
          name: 'test',
          helpNumbersCategory: helpNumbersCategory._id
        })
        .expect(422)
    })
  })
})
