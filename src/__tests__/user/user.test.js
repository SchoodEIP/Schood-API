const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../serverUtils/testServer')
const dbDefault = require('../../../config/db.default')
const { Users } = require('../../../models/user')

describe('User route tests', () => {
  let app

  beforeAll(async () => {
    app = await server.testServer()
  })

  afterEach(async () => {
    const collections = mongoose.connection.collections
    for (const key in collections) {
      const collection = collections[key]
      collection.deleteMany()
    }
    await dbDefault()
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  describe('Login route', () => {
    it('POST /user/login => Try good login', async () => {
      return await request(app)
        .post('/user/login')
        .send({
          username: 'admin',
          password: 'admin123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
    })

    it('POST /user/login => Try bad username', async () => {
      return await request(app)
        .post('/user/login')
        .send({
          username: 'test',
          password: 'admin123'
        })
        .expect(401)
    })

    it('POST /user/login => Try bad password', async () => {
      return await request(app)
        .post('/user/login')
        .send({
          username: 'admin',
          password: 'test'
        })
        .expect(401)
    })

    it('POST /user/login => Try bad form', async () => {
      return await request(app)
        .post('/user/login')
        .send({
          username: 'test'
        })
        .expect(401)
    })
  })

  describe('ChangePassword route', () => {
    it('POST /user/password => Try change password', async () => {
      let key

      await request(app)
        .post('/user/login')
        .send({
          username: 'admin',
          password: 'admin123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })

      await request(app)
        .patch('/user/password')
        .set({
          'x-auth-token': key
        })
        .send({
          password: 'test'
        })
        .expect(200)

      return await request(app)
        .post('/user/login')
        .send({
          username: 'admin',
          password: 'test'
        })
        .expect(200)
    })

    it('POST /user/password => Try bad token', async () => {
      return await request(app)
        .patch('/user/password')
        .set({
          'x-auth-token': 'test'
        })
        .send({
          password: 'test'
        })
        .expect(400)
    })

    it('POST /user/password => Try No token', async () => {
      return await request(app)
        .patch('/user/password')
        .send({
          password: 'test'
        })
        .expect(403)
    })

    it('POST /user/password => Try if user not exist', async () => {
      let key

      await request(app)
        .post('/user/login')
        .send({
          username: 'admin',
          password: 'admin123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })

      await Users.findOneAndRemove({ username: 'admin' })

      return await request(app)
        .patch('/user/password')
        .set({
          'x-auth-token': key
        })
        .send({
          password: 'test'
        })
        .expect(500)
    })
  })
})
