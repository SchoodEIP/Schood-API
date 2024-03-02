const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')
const { Questionnaires } = require('../../../../models/questionnaire')

describe('Student dailyMood route tests', () => {
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

  describe('dailyMood route', () => {
    it('GET /student/questionnaire/:id => Try good register dailyMood', async () => {
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
      await request(app)
        .post('/student/dailyMood/')
        .set({
          'x-auth-token': key
        })
        .send({
          mood: 1
        })
        .expect(200)
    })

    it('GET /student/questionnaire/:id => Try bad register dailyMood bad body', async () => {
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
      await request(app)
        .post('/student/dailyMood/')
        .set({
          'x-auth-token': key
        })
        .send({
        })
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('GET /student/questionnaire/:id => Try good register dailyMood rewrite', async () => {
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
      await request(app)
        .post('/student/dailyMood/')
        .set({
          'x-auth-token': key
        })
        .send({
          mood: 1
        })
        .expect(200)
      await request(app)
        .post('/student/dailyMood/')
        .set({
          'x-auth-token': key
        })
        .send({
          mood: 2
        })
        .expect(200)
    })
  })
})
