const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')

describe('Facility route tests', () => {
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
    it('POST /admin/facility/register => Try good register', async () => {
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
        .post('/admin/facility/register')
        .set({
          'x-auth-token': key
        })
        .send({
          name: 'Test',
          telephone: '0102030405',
          address: '3 rue test',
          level: 1
        })
        .expect(200)
    })

    it('POST /admin/facility/register => Try empty name', async () => {
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
        .post('/admin/facility/register')
        .set({
          'x-auth-token': key
        })
        .send({
          name: '',
          telephone: '0102030405',
          address: '3 rue test',
          level: 1
        })
        .expect(400)
    })

    it('POST /admin/facility/register => Try too short telephone', async () => {
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
        .post('/admin/facility/register')
        .set({
          'x-auth-token': key
        })
        .send({
          name: 'Test',
          telephone: '010203040',
          address: '3 rue test',
          level: 1
        })
        .expect(400)
    })

    it('POST /admin/facility/register => Try too long telephone', async () => {
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
        .post('/admin/facility/register')
        .set({
          'x-auth-token': key
        })
        .send({
          name: 'Test',
          telephone: '01020304050',
          address: '3 rue test',
          level: 1
        })
        .expect(400)
    })

    it('POST /admin/facility/register => Try telephone with letter', async () => {
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
        .post('/admin/facility/register')
        .set({
          'x-auth-token': key
        })
        .send({
          name: 'Test',
          telephone: '010203040a',
          address: '3 rue test',
          level: 1
        })
        .expect(400)
    })

    it('POST /admin/facility/register => Try empty address', async () => {
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
        .post('/admin/facility/register')
        .set({
          'x-auth-token': key
        })
        .send({
          name: 'Test',
          telephone: '0102030405',
          address: '',
          level: 1
        })
        .expect(400)
    })

    it('POST /admin/facility/register => Try level < 0', async () => {
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
        .post('/admin/facility/register')
        .set({
          'x-auth-token': key
        })
        .send({
          name: 'Test',
          telephone: '0102030405',
          address: '3 rue test',
          level: -1
        })
        .expect(400)
    })

    it('POST /admin/facility/register => Try level > 4', async () => {
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
        .post('/admin/facility/register')
        .set({
          'x-auth-token': key
        })
        .send({
          name: 'Test',
          telephone: '0102030405',
          address: '3 rue test',
          level: 5
        })
        .expect(400)
    })

    it('POST /admin/facility/register => Try bad form', async () => {
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
        .post('/admin/facility/register')
        .set({
          'x-auth-token': key
        })
        .send({
          name: 'Test',
          address: '3 rue test',
          level: 5
        })
        .expect(400)
    })
  })
})
