const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')

describe('Shared Questionnaire route tests', () => {
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

  describe('getQuestionnaire route', () => {
    it('GET /shared/questionnaire/ => Try good getQuestionnaire teacher', async () => {
      let key
      await request(app)
        .post('/user/login')
        .send({
          email: 'pierre.dubois.Schood1@schood.fr',
          password: 'Pierre_123'
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
          date: new Date(),
          questions: [
            {
              title: 'Question1',
              type: 'text'
            }
          ]
        })
        .expect(200)
        .then(async () => {
          await request(app)
            .get('/shared/questionnaire/')
            .set({
              'x-auth-token': key
            })
            .expect(200)
        })
    })
    it('GET /shared/questionnaire/ => Try good getQuestionnaire student', async () => {
      let keyTeacher
      let keyStudent
      await request(app)
        .post('/user/login')
        .send({
          email: 'pierre.dubois.Schood1@schood.fr',
          password: 'Pierre_123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          keyTeacher = response.body.token
        })

      await request(app)
        .post('/teacher/questionnaire')
        .set({
          'x-auth-token': keyTeacher
        })
        .send({
          title: 'test',
          date: new Date(),
          questions: [
            {
              title: 'Question1',
              type: 'text'
            }
          ]
        })
        .expect(200)
        .then(async () => {
          await request(app)
            .post('/user/login')
            .send({
              email: 'alice.johnson.Schood1@schood.fr',
              password: 'Alice_123'
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
              keyStudent = response.body.token
            })
          await request(app)
            .get('/shared/questionnaire/')
            .set({
              'x-auth-token': keyStudent
            })
            .expect(200)
        })
    })
  })
})
