const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../serverUtils/testServer')
const dbDefault = require('../../../config/db.default')
const { Users } = require('../../../models/users')
const { Roles } = require('../../../models/roles')

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

  describe('changePassword route', () => {
    it('PATCH /user/changePassword => Try no old password', async () => {
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
        .patch('/user/changePassword')
        .set({
          'x-auth-token': key
        })
        .send({
          oldPassword: '',
          newPassword: 'Test123',
        })
        .expect(400)
    })

    it('PATCH /user/changePassword => Try no new password', async () => {
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
        .patch('/user/changePassword')
        .set({
          'x-auth-token': key
        })
        .send({
          oldPassword: 'Test123',
          newPassword: '',
        })
        .expect(400)
    })

    it('PATCH /user/changePassword => Try same old password and new password', async () => {
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
        .patch('/user/changePassword')
        .set({
          'x-auth-token': key
        })
        .send({
          oldPassword: 'Test123',
          newPassword: 'Test123',
        })
        .expect(422)
    })

    it('PATCH /user/changePassword => Try new password missing uppercase letter', async () => {
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
        .patch('/user/changePassword')
        .set({
          'x-auth-token': key
        })
        .send({
          oldPassword: 'Test000',
          newPassword: 'test123',
        })
        .expect(400)
    })

    it('PATCH /user/changePassword => Try new password missing lowercase letter', async () => {
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
        .patch('/user/changePassword')
        .set({
          'x-auth-token': key
        })
        .send({
          oldPassword: 'Test000',
          newPassword: 'TEST123',
        })
        .expect(400)
    })

    it('PATCH /user/changePassword => Try new password missing digit', async () => {
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
        .patch('/user/changePassword')
        .set({
          'x-auth-token': key
        })
        .send({
          oldPassword: 'Test000',
          newPassword: 'Testtest',
        })
        .expect(400)
    })

    it('PATCH /user/changePassword => Try not long enough new password', async () => {
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
        .patch('/user/changePassword')
        .set({
          'x-auth-token': key
        })
        .send({
          oldPassword: 'Test000',
          newPassword: 'Tes123',
        })
        .expect(400)
    })

    it('PATCH /user/changePassword => Try bad old password', async () => {
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
        .patch('/user/changePassword')
        .set({
          'x-auth-token': key
        })
        .send({
          oldPassword: 'Test000',
          newPassword: 'Test123',
        })
        .expect(400)
    })

    it('PATCH /user/changePassword => Try good request', async () => {
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
        .patch('/user/changePassword')
        .set({
          'x-auth-token': key
        })
        .send({
          oldPassword: 'admin123',
          newPassword: 'Test123',
        })
        .expect(200)

      // return await request(app)
      //   .post('/user/login')
      //   .send({
      //     email: 'admin@schood.fr',
      //     password: 'Test123'
      //   })
      //   .expect('Content-Type', /json/)
      //   .expect(200)
      //   .then((response) => {
      //     key = response.body.token
      //   })
    })
  })
})
