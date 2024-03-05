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

  describe('getAllUsers route', () => {
    it('GET /user/by/student => Try get all students', async () => {
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
        .get('/user/by/student')
        .set({
          'x-auth-token': key
        })
        .expect('Content-Type', /json/)
        .expect(200)
    })

    it('GET /user/by/teacher => Try get all teacher', async () => {
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
        .get('/user/by/teacher')
        .set({
          'x-auth-token': key
        })
        .expect('Content-Type', /json/)
        .expect(200)
    })

    it('GET /user/by/administration => Try get all administration', async () => {
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
        .get('/user/by/administration')
        .set({
          'x-auth-token': key
        })
        .expect('Content-Type', /json/)
        .expect(200)
    })

    it('GET /user/by/admin => Try get all admin', async () => {
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
        .get('/user/by/admin')
        .set({
          'x-auth-token': key
        })
        .expect('Content-Type', /json/)
        .expect(200)
    })

    it('GET /user/by/admin => Try get all admin bad perm', async () => {
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
        .get('/user/by/admin')
        .set({
          'x-auth-token': key
        })
        .expect('Content-Type', /json/)
        .expect(403)
    })

    it('GET /user/by/student => Try get all student bad perm', async () => {
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
        .get('/user/by/student')
        .set({
          'x-auth-token': key
        })
        .expect('Content-Type', /json/)
        .expect(403)
    })
  })

  describe('getUsersByPosition route', () => {
    it('GET /user/all => Try get all teacher, student', async () => {
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
        .get('/user/all')
        .set({
          'x-auth-token': key
        })
        .expect('Content-Type', /json/)
        .expect(200)
    })

    it('GET /user/all => Try get all administrator, admin', async () => {
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
        .get('/user/all')
        .set({
          'x-auth-token': key
        })
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })
})
