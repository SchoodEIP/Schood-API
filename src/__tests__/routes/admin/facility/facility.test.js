const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')

describe('Facility route tests', () => {
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
    it('POST /admin/facility => Try good register', async () => {
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
        .post('/admin/facility')
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

    it('POST /admin/facility => Try empty name', async () => {
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
        .post('/admin/facility')
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

    it('POST /admin/facility => Try too short telephone', async () => {
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
        .post('/admin/facility')
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

    it('POST /admin/facility => Try too long telephone', async () => {
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
        .post('/admin/facility')
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

    it('POST /admin/facility => Try telephone with letter', async () => {
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
        .post('/admin/facility')
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

    it('POST /admin/facility => Try empty address', async () => {
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
        .post('/admin/facility')
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

    it('POST /admin/facility => Try level < 0', async () => {
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
        .post('/admin/facility')
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

    it('POST /admin/facility => Try level > 4', async () => {
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
        .post('/admin/facility')
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

    it('POST /admin/facility => Try bad form', async () => {
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
        .post('/admin/facility')
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
