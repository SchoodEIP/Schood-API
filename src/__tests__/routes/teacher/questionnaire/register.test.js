const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')

describe('Teacher Questionnaire route tests', () => {
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
    await dbDefault()
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
  })

  describe('Register route', () => {
    it('POST /teacher/questionnaire => Try good register', async () => {
      let key
      await request(app)
        .post('/user/login')
        .send({
          email: 'teacher1@schood.fr',
          password: 'teacher123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })

      return await request(app)
        .post('/teacher/questionnaire')
        .set({
          'x-auth-token': key
        })
        .send({
          title: 'test',
          date: new Date(),
          questions: [
            {
              title: 'Question1',
              type: 'text'
            },
            {
              title: 'Question1',
              type: 'multiple',
              answers: [
                {
                  position: 1,
                  title: 'Test'
                }
              ]
            }
          ]
        })
        .expect(200)
    })
    it('POST /teacher/questionnaire => Try bad register', async () => {
      let key
      await request(app)
        .post('/user/login')
        .send({
          email: 'teacher1@schood.fr',
          password: 'teacher123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })

      return await request(app)
        .post('/teacher/questionnaire')
        .set({
          'x-auth-token': key
        })
        .send({
          title: 'test'
        })
        .expect(400)
    })
    it('POST /teacher/questionnaire => Try bad register already exist', async () => {
      let key
      await request(app)
        .post('/user/login')
        .send({
          email: 'teacher1@schood.fr',
          password: 'teacher123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })

      await request(app)
        .post('/teacher/questionnaire')
        .set({
          'x-auth-token': key
        })
        .send({
          title: 'test',
          date: '2023-09-05',
          questions: [
            {
              title: 'Question1',
              type: 'text'
            }
          ]
        })
        .expect(200)
      await request(app)
        .post('/teacher/questionnaire')
        .set({
          'x-auth-token': key
        })
        .send({
          title: 'test',
          date: '2023-09-05',
          questions: [
            {
              title: 'Question1',
              type: 'text'
            }
          ]
        })
        .expect(400)
    })
    it('POST /teacher/questionnaire => Try bad register bad multiple 1', async () => {
      let key
      await request(app)
        .post('/user/login')
        .send({
          email: 'teacher1@schood.fr',
          password: 'teacher123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })

      return await request(app)
        .post('/teacher/questionnaire')
        .set({
          'x-auth-token': key
        })
        .send({
          title: 'test',
          date: new Date(),
          questions: [
            {
              title: 'Question1',
              type: 'multiple'
            }
          ]
        })
        .expect(400)
    })
  })
})
