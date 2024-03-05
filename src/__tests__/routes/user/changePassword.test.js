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

  describe('changePassword route', () => {
    it('PATCH /user/changePassword => Try no old password', async () => {
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
        .patch('/user/changePassword')
        .set({
          'x-auth-token': key
        })
        .send({
          oldPassword: '',
          newPassword: 'Test123'
        })
        .expect(400)
    })

    it('PATCH /user/changePassword => Try no new password', async () => {
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
        .patch('/user/changePassword')
        .set({
          'x-auth-token': key
        })
        .send({
          oldPassword: 'Test123',
          newPassword: ''
        })
        .expect(400)
    })

    it('PATCH /user/changePassword => Try same old password and new password', async () => {
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
        .patch('/user/changePassword')
        .set({
          'x-auth-token': key
        })
        .send({
          oldPassword: 'Test123',
          newPassword: 'Test123'
        })
        .expect(422)
    })

    it('PATCH /user/changePassword => Try new password missing uppercase letter', async () => {
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
        .patch('/user/changePassword')
        .set({
          'x-auth-token': key
        })
        .send({
          oldPassword: 'Test000',
          newPassword: 'test123'
        })
        .expect(400)
    })

    it('PATCH /user/changePassword => Try new password missing lowercase letter', async () => {
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
        .patch('/user/changePassword')
        .set({
          'x-auth-token': key
        })
        .send({
          oldPassword: 'Test000',
          newPassword: 'TEST123'
        })
        .expect(400)
    })

    it('PATCH /user/changePassword => Try new password missing digit', async () => {
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
        .patch('/user/changePassword')
        .set({
          'x-auth-token': key
        })
        .send({
          oldPassword: 'Test000',
          newPassword: 'Testtest'
        })
        .expect(400)
    })

    it('PATCH /user/changePassword => Try not long enough new password', async () => {
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
        .patch('/user/changePassword')
        .set({
          'x-auth-token': key
        })
        .send({
          oldPassword: 'Test000',
          newPassword: 'Tes123'
        })
        .expect(400)
    })

    it('PATCH /user/changePassword => Try bad old password', async () => {
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
        .patch('/user/changePassword')
        .set({
          'x-auth-token': key
        })
        .send({
          oldPassword: 'Test000',
          newPassword: 'Test123'
        })
        .expect(400)
    })

    it('PATCH /user/changePassword => Try good requests', async () => {
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

      await request(app)
        .patch('/user/changePassword')
        .set({
          'x-auth-token': key
        })
        .send({
          oldPassword: 'admin_123',
          newPassword: 'Test123'
        })
        .expect(200)

      return await request(app)
        .post('/user/login')
        .send({
          email: 'admin.Schood1@schood.fr',
          password: 'Test123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
    })

    it('PATCH /user/changePassword => Try good request 2nd connection', async () => {
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

      await request(app)
        .patch('/user/changePassword')
        .set({
          'x-auth-token': key
        })
        .send({
          oldPassword: 'admin_123',
          newPassword: 'Test123'
        })
        .expect(200)

      await request(app)
        .patch('/user/changePassword')
        .set({
          'x-auth-token': key
        })
        .send({
          oldPassword: 'Test123',
          newPassword: 'Test321'
        })
        .expect(200)

      return await request(app)
        .post('/user/login')
        .send({
          email: 'admin.Schood1@schood.fr',
          password: 'Test321'
        })
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })
})
