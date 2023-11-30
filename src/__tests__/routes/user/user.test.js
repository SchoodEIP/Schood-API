const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../serverUtils/testServer')
const dbDefault = require('../../../config/db.default')
const { Users } = require('../../../models/users')
const { Roles } = require('../../../models/roles')

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

  describe('Login route', () => {
    it('POST /user/login => Try good login', async () => {
      return await request(app)
        .post('/user/login')
        .send({
          email: 'admin@schood.fr',
          password: 'admin123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
    })

    it('POST /user/login => Try bad email', async () => {
      return await request(app)
        .post('/user/login')
        .send({
          email: 'test',
          password: 'admin123'
        })
        .expect(400)
    })

    it('POST /user/login => Try bad password', async () => {
      return await request(app)
        .post('/user/login')
        .send({
          email: 'admin@schood.fr',
          password: 'test'
        })
        .expect(401)
    })

    it('POST /user/login => Try bad form', async () => {
      return await request(app)
        .post('/user/login')
        .send({
          email: 'test'
        })
        .expect(400)
    })

    it('POST /adm/register => Try bad token', async () => {
      const key = 'nope'
      return await request(app)
        .post('/adm/register/?mail=false')
        .set({
          'x-auth-token': key
        })
        .send({
          email: 'schood.eip@gmail.com',
          firstname: 'studentTest',
          lastname: 'studentTest',
          role: 'nope',
          classes: [
            {
              name: '200'
            }
          ]
        })
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('POST /adm/register => Try no token', async () => {
      return await request(app)
        .post('/adm/register/?mail=false')
        .send({
          email: 'schood.eip@gmail.com',
          firstname: 'studentTest',
          lastname: 'studentTest',
          role: 'nope',
          classes: [
            {
              name: '200'
            }
          ]
        })
        .expect('Content-Type', /json/)
        .expect(403)
    })

    it('POST /adm/register => Try user not exist', async () => {
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

      await Users.findOneAndRemove({ firstname: 'admin' })

      return await request(app)
        .post('/adm/register/?mail=false')
        .set({
          'x-auth-token': key
        })
        .send({
          email: 'schood.eip@gmail.com',
          firstname: 'studentTest',
          lastname: 'studentTest',
          role: 'nope',
          classes: [
            {
              name: '200'
            }
          ]
        })
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('POST /adm/register => Try user no role', async () => {
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

      await Roles.findOneAndRemove({ name: 'admin' })

      return await request(app)
        .post('/adm/register/?mail=false')
        .set({
          'x-auth-token': key
        })
        .send({
          email: 'schood.eip@gmail.com',
          firstname: 'studentTest',
          lastname: 'studentTest',
          role: 'nope',
          classes: [
            {
              name: '200'
            }
          ]
        })
        .expect('Content-Type', /json/)
        .expect(403)
    })
  })
})
