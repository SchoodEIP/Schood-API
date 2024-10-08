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
          email: 'admin.Schood1@schood.fr',
          password: 'admin_123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
    })

    it('POST /user/login => Try bad email', async () => {
      return await request(app)
        .post('/user/login')
        .send({
          email: 'test',
          password: 'admin_123'
        })
        .expect(400)
    })

    it('POST /user/login => Try bad password', async () => {
      return await request(app)
        .post('/user/login')
        .send({
          email: 'admin.Schood1@schood.fr',
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

    it('POST /user/login => Try inactive user', async () => {
      const user = await Users.findOne({ email: 'alice.johnson.Schood1@schood.fr' })

      user.active = false
      user.save()
      return await request(app)
        .post('/user/login')
        .send({
          email: 'alice.johnson.Schood1@schood.fr',
          password: 'Alice_123'
        })
        .expect(403)
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
        .expect(403)
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
          email: 'admin.Schood1@schood.fr',
          password: 'admin_123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })

      await Users.findOneAndDelete({ firstname: 'admin' })

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

    it('POST /adm/register => Try user no role', async () => {
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

      await Roles.findOneAndDelete({ name: 'admin' })

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

    it('POST /adm/register => Try user no access', async () => {
      let key

      await request(app)
        .post('/user/login')
        .send({
          email: 'alice.johnson.Schood1@schood.fr',
          password: 'Alice_123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })

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

    it('POST /adm/register => Try user no access onlyMode', async () => {
      let key

      await request(app)
        .post('/user/login')
        .send({
          email: 'alice.johnson.Schood1@schood.fr',
          password: 'Alice_123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })

      return await request(app)
        .get('/teacher/dailyMood/test')
        .set({
          'x-auth-token': key
        })
        .expect('Content-Type', /json/)
        .expect(403)
    })

    it('GET /user/tokenCheck => Try tokenCheck', async () => {
      let key

      await request(app)
        .post('/user/login')
        .send({
          email: 'alice.johnson.Schood1@schood.fr',
          password: 'Alice_123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })

      return await request(app)
        .get('/user/tokenCheck/')
        .set({
          'x-auth-token': key
        })
        .expect(200)
    })
  })
})
