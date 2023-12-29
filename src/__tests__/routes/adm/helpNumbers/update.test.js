const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')
const { HelpNumbersCategories } = require('../../../../models/helpNumbersCategories')
const { HelpNumbers } = require('../../../../models/helpNumbers')

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
    it('PATCH /adm/helpNumber/:id => Try update good request', async () => {
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
          helpNumbersCategory: helpNumbersCategory._id,
          description: 'Random description'
        })
        .expect(200)

      const _helpNumber = await HelpNumbers.findOne({ name: 'test' })

      return await request(app)
        .patch(`/adm/helpNumber/${_helpNumber._id}`)
        .set({
          'x-auth-token': key
        })
        .send({
          name: 'testee',
          telephone: '0102030405',
          email: 'test.mail@gmail.com',
          helpNumbersCategory: helpNumbersCategory._id,
          description: 'Random description'
        })
        .expect(200)
    })

    it('PATCH /adm/helpNumber/:id => Try register bad request', async () => {
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
          helpNumbersCategory: helpNumbersCategory._id,
          description: 'Random description'
        })
        .expect(200)

      const helpNumber = await HelpNumbers.findOne({ name: 'test' })
      return await request(app)
        .patch(`/adm/helpNumber/${helpNumber._id}`)
        .set({
          'x-auth-token': key
        })
        .send({
        })
        .expect(400)
    })

    it('PATCH /adm/helpNumber/:id => Try register name already used', async () => {
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
          helpNumbersCategory: helpNumbersCategory._id,
          description: 'Random description'
        })
        .expect(200)

      await request(app)
        .post('/adm/helpNumber/register')
        .set({
          'x-auth-token': key
        })
        .send({
          name: 'test 2',
          telephone: '0102030405',
          email: 'test.mail@gmail.com',
          helpNumbersCategory: helpNumbersCategory._id,
          description: 'Random description'
        })
        .expect(200)

      const helpNumber = await HelpNumbers.findOne({ name: 'test' })
      return await request(app)
        .patch(`/adm/helpNumber/${helpNumber._id}`)
        .set({
          'x-auth-token': key
        })
        .send({
          name: 'test 2',
          telephone: '0102030405',
          email: 'test.mail@gmail.com',
          helpNumbersCategory: helpNumbersCategory._id,
          description: 'Random description'
        })
        .expect(422)
    })
  })
})
