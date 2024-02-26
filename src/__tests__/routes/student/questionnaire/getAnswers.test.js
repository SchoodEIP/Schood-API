const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')
const { Questionnaires } = require('../../../../models/questionnaire')

describe('Student Questionnaire route tests', () => {
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

  describe('getAnswers route', () => {
    it('GET /student/questionnaire/:id => Try good getAnswers', async () => {
      let keyTeacher
      let keyStudent
      let questionnaireId
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
          questionnaireId = await Questionnaires.findOne()
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
            .get('/student/questionnaire/' + questionnaireId._id)
            .set({
              'x-auth-token': keyStudent
            })
            .expect(200)
        })
    })
    it('GET /student/questionnaire/:id => Try bad getAnswers invalid questionnaireID', async () => {
      let keyStudent
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
        .get('/student/questionnaire/nope')
        .set({
          'x-auth-token': keyStudent
        })
        .expect(400)
    })
    it('GET /student/questionnaire/:id => Try bad getAnswers invalid questionnaireID 2', async () => {
      let keyStudent
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
        .get('/student/questionnaire/64f258afe6d3d02761a011ed')
        .set({
          'x-auth-token': keyStudent
        })
        .expect(400)
    })
  })
})
