const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../serverUtils/testServer')
const dbDefault = require('../../config/db.default')

describe('Facility route tests', () => {
  let app

  beforeAll(async () => {
    app = await server.testServer()
  })

  afterEach(async () => {
    const collections = mongoose.connection.collections
    for (const key in collections) {
      const collection = collections[key]
      if (collection) { collection.deleteMany() }
    }
    await dbDefault()
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  describe('Register route', () => {
    it('POST /facility/register => Try good register', async () => {
      return await request(app)
        .post('/facility/register')
        .send({
          name: 'Test',
          telephone: '0102030405',
          address: '3 rue test',
          level: 1
        })
        .expect('Content-Type', /json/)
        .expect(200)
    })

    it('POST /facility/register => Try empty name', async () => {
      return await request(app)
        .post('/facility/register')
        .send({
          name: '',
          telephone: '0102030405',
          address: '3 rue test',
          level: 1
        })
        .expect(400)
    })

    it('POST /facility/register => Try too short telephone', async () => {
      return await request(app)
        .post('/facility/register')
        .send({
          name: 'Test',
          telephone: '010203040',
          address: '3 rue test',
          level: 1
        })
        .expect(400)
    })

    it('POST /facility/register => Try too long telephone', async () => {
      return await request(app)
        .post('/facility/register')
        .send({
          name: 'Test',
          telephone: '01020304050',
          address: '3 rue test',
          level: 1
        })
        .expect(400)
    })

    it('POST /facility/register => Try telephone with letter', async () => {
      return await request(app)
        .post('/facility/register')
        .send({
          name: 'Test',
          telephone: '010203040a',
          address: '3 rue test',
          level: 1
        })
        .expect(400)
    })

    it('POST /facility/register => Try empty address', async () => {
      return await request(app)
        .post('/facility/register')
        .send({
          name: 'Test',
          telephone: '0102030405',
          address: '',
          level: 1
        })
        .expect(400)
    })

    it('POST /facility/register => Try level < 0', async () => {
      return await request(app)
        .post('/facility/register')
        .send({
          name: 'Test',
          telephone: '0102030405',
          address: '3 rue test',
          level: -1
        })
        .expect(400)
    })

    it('POST /facility/register => Try level > 4', async () => {
      return await request(app)
        .post('/facility/register')
        .send({
          name: 'Test',
          telephone: '0102030405',
          address: '3 rue test',
          level: 5
        })
        .expect(400)
    })

    it('POST /facility/register => Try bad form', async () => {
      return await request(app)
        .post('/facility/register')
        .send({
          name: 'Test',
          address: '3 rue test',
          level: 5
        })
        .expect(400)
    })
  })
})
