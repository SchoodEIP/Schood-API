const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../serverUtils/testServer')
const dbDefault = require('../../../config/db.default')

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

  describe('Csv register user route', () => {
    it('POST /adm/csvRegisterUser => Try register good csv', async () => {
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
        .post('/adm/csvRegisterUser')
        .set({
          'x-auth-token': key
        })
        .attach('csv', "__tests__/fixtures/adm/csvRegisterUser/correct.csv")
        .expect('Content-Type', /json/)
        .expect(200)
    })

    it('POST /adm/csvRegisterUser => Try register empty file', async () => {
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
        .post('/adm/csvRegisterUser')
        .set({
          'x-auth-token': key
        })
        .attach('csv', "__tests__/fixtures/adm/csvRegisterUser/empty.csv")
        .expect('Content-Type', /json/)
        .expect(422)
    })

    it('POST /adm/csvRegisterUser => Try register bad header (not in list)', async () => {
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
        .post('/adm/csvRegisterUser')
        .set({
          'x-auth-token': key
        })
        .attach('csv', "__tests__/fixtures/adm/csvRegisterUser/wrongHeaderNotInList.csv")
        .expect('Content-Type', /json/)
        .expect(422)
    })

    it('POST /adm/csvRegisterUser => Try register bad body (empty)', async () => {
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
        .post('/adm/csvRegisterUser')
        .set({
          'x-auth-token': key
        })
        .attach('csv', "__tests__/fixtures/adm/csvRegisterUser/wrongBodyEmpty.csv")
        .expect('Content-Type', /json/)
        .expect(422)
    })

    it('POST /adm/csvRegisterUser => Try register bad body (user already exist)', async () => {
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
        .post('/adm/csvRegisterUser')
        .set({
          'x-auth-token': key
        })
        .attach('csv', "__tests__/fixtures/adm/csvRegisterUser/wrongBodyUserAlreadyExist.csv")
        .expect('Content-Type', /json/)
        .expect(422)
    })

    it('POST /adm/csvRegisterUser => Try register bad body (wrong class)', async () => {
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
        .post('/adm/csvRegisterUser')
        .set({
          'x-auth-token': key
        })
        .attach('csv', "__tests__/fixtures/adm/csvRegisterUser/wrongBodyWrongClass.csv")
        .expect('Content-Type', /json/)
        .expect(422)
    })

    it('POST /adm/csvRegisterUser => Try register bad body (wrong email)', async () => {
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
        .post('/adm/csvRegisterUser')
        .set({
          'x-auth-token': key
        })
        .attach('csv', "__tests__/fixtures/adm/csvRegisterUser/wrongBodyWrongEmail.csv")
        .expect('Content-Type', /json/)
        .expect(422)
    })

    it('POST /adm/csvRegisterUser => Try register bad body (wrong firstname)', async () => {
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
        .post('/adm/csvRegisterUser')
        .set({
          'x-auth-token': key
        })
        .attach('csv', "__tests__/fixtures/adm/csvRegisterUser/wrongBodyWrongFirstname.csv")
        .expect('Content-Type', /json/)
        .expect(422)
    })

    it('POST /adm/csvRegisterUser => Try register bad body (wrong lastname)', async () => {
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
        .post('/adm/csvRegisterUser')
        .set({
          'x-auth-token': key
        })
        .attach('csv', "__tests__/fixtures/adm/csvRegisterUser/wrongBodyWrongLastname.csv")
        .expect('Content-Type', /json/)
        .expect(422)
    })

    it('POST /adm/csvRegisterUser => Try register bad body (wrong role)', async () => {
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
        .post('/adm/csvRegisterUser')
        .set({
          'x-auth-token': key
        })
        .attach('csv', "__tests__/fixtures/adm/csvRegisterUser/wrongBodyWrongRole.csv")
        .expect('Content-Type', /json/)
        .expect(422)
    })

    it('POST /adm/csvRegisterUser => Try register bad access level', async () => {
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
        .post('/adm/csvRegisterUser')
        .set({
          'x-auth-token': key
        })
        .attach('csv', "__tests__/fixtures/adm/csvRegisterUser/correct.csv")
        .expect('Content-Type', /json/)
        .expect(403)
    })
  })
})
