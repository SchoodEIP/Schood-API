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

  describe('Register route', () => {
    it('POST /student/questionnaire/:id => Try good register', async () => {
      let keyTeacher
      let keyStudent
      let questionnaireId
      let questionId
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
          questionnaireId = await Questionnaires.findOne({ title: 'test' })
          questionId = questionnaireId.questions[0]._id
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
            .post('/student/questionnaire/' + questionnaireId._id)
            .set({
              'x-auth-token': keyStudent
            })
            .send({
              answers: [
                {
                  question: questionId,
                  answers: ['Test']
                }
              ]
            })
            .expect(200)
        })
    })
    it('POST /student/questionnaire/:id => Try bad register invalid questionnaireId', async () => {
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
        .post('/student/questionnaire/nope')
        .set({
          'x-auth-token': keyStudent
        })
        .send({
          answers: [
            {
              question: '64f258afe6d3d02761a011ed',
              answers: ['Test']
            }
          ]
        })
        .expect(400)
    })
    it('POST /student/questionnaire/:id => Try bad register invalid questionnaireId 2', async () => {
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
        .post('/student/questionnaire/64f258afe6d3d02761a011ed')
        .set({
          'x-auth-token': keyStudent
        })
        .send({
          answers: [
            {
              question: '64f258afe6d3d02761a011ed',
              answers: ['Test']
            }
          ]
        })
        .expect(400)
    })
    it('POST /student/questionnaire/:id => Try bad register already answered', async () => {
      let keyTeacher
      let keyStudent
      let questionnaireId
      let questionId
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
          questionnaireId = await Questionnaires.findOne({ title: 'test' })
          questionId = questionnaireId.questions[0]._id
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
            .post('/student/questionnaire/' + questionnaireId._id)
            .set({
              'x-auth-token': keyStudent
            })
            .send({
              answers: [
                {
                  question: questionId,
                  answers: ['Test']
                }
              ]
            })
            .expect(200)
          await request(app)
            .post('/student/questionnaire/' + questionnaireId._id)
            .set({
              'x-auth-token': keyStudent
            })
            .send({
              answers: [
                {
                  question: questionId,
                  answer: 'Test'
                }
              ]
            })
            .expect(400)
        })
    })
    it('POST /student/questionnaire/:id => Try bad register already answered', async () => {
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
            .post('/student/questionnaire/' + questionnaireId._id)
            .set({
              'x-auth-token': keyStudent
            })
            .send({
            })
            .expect(400)
        })
    })
    it('POST /student/questionnaire/:id => Try bad register invalid questionId', async () => {
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
            .post('/student/questionnaire/' + questionnaireId._id)
            .set({
              'x-auth-token': keyStudent
            })
            .send({
              answers: [
                {
                  question: '64f258afe6d3d02761a011ed',
                  answers: ['Test']
                }
              ]
            })
            .expect(400)
        })
    })
  })
})
