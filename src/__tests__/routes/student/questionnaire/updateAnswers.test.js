const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')
const { Questionnaire } = require('../../../../models/questionnaire')

describe('Student Questionnaire route tests', () => {
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

  describe('Update route', () => {
    it('PATCH /student/questionnaire/:id => Try good update', async () => {
      let keyTeacher
      let keyStudent
      let questionnaireId
      let questionId
      await request(app)
        .post('/user/login')
        .send({
          email: 'teacher1@schood.fr',
          password: 'teacher123'
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
          questionnaireId = await Questionnaire.findOne()
          questionId = questionnaireId.questions[0]._id
          await request(app)
            .post('/user/login')
            .send({
              email: 'student1@schood.fr',
              password: 'student123'
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
                  answer: 'Test'
                }
              ]
            })
            .expect(200)
          await request(app)
            .patch('/student/questionnaire/' + questionnaireId._id)
            .set({
              'x-auth-token': keyStudent
            })
            .send({
              answers: [
                {
                  question: questionId,
                  answer: 'TestU'
                }
              ]
            })
            .expect(200)
        })
    })
    it('PATCH /student/questionnaire/:id => Try bad update invalid questionnaireId', async () => {
      let keyStudent
      await request(app)
        .post('/user/login')
        .send({
          email: 'student1@schood.fr',
          password: 'student123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          keyStudent = response.body.token
        })
      await request(app)
        .patch('/student/questionnaire/nope')
        .set({
          'x-auth-token': keyStudent
        })
        .send({
          answers: [
            {
              question: '64f258afe6d3d02761a011ed',
              answer: 'Test'
            }
          ]
        })
        .expect(400)
    })
    it('PATCH /student/questionnaire/:id => Try bad update invalid questionnaireId 2', async () => {
      let keyStudent
      await request(app)
        .post('/user/login')
        .send({
          email: 'student1@schood.fr',
          password: 'student123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          keyStudent = response.body.token
        })
      await request(app)
        .patch('/student/questionnaire/64f258afe6d3d02761a011ed')
        .set({
          'x-auth-token': keyStudent
        })
        .send({
          answers: [
            {
              question: '64f258afe6d3d02761a011ed',
              answer: 'Test'
            }
          ]
        })
        .expect(400)
    })
    it('PATCH /student/questionnaire/:id => Try bad update not answered', async () => {
      let keyTeacher
      let keyStudent
      let questionnaireId
      let questionId
      await request(app)
        .post('/user/login')
        .send({
          email: 'teacher1@schood.fr',
          password: 'teacher123'
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
          questionnaireId = await Questionnaire.findOne()
          questionId = questionnaireId.questions[0]._id
          await request(app)
            .post('/user/login')
            .send({
              email: 'student1@schood.fr',
              password: 'student123'
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
              keyStudent = response.body.token
            })
          await request(app)
            .patch('/student/questionnaire/' + questionnaireId._id)
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
    it('POST /student/questionnaire/:id => Try bad update no body', async () => {
      let keyTeacher
      let keyStudent
      let questionnaireId
      let questionId
      await request(app)
        .post('/user/login')
        .send({
          email: 'teacher1@schood.fr',
          password: 'teacher123'
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
          questionnaireId = await Questionnaire.findOne()
          questionId = questionnaireId.questions[0]._id
          await request(app)
            .post('/user/login')
            .send({
              email: 'student1@schood.fr',
              password: 'student123'
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
                  answer: 'Test'
                }
              ]
            })
            .expect(200)
          await request(app)
            .patch('/student/questionnaire/' + questionnaireId._id)
            .set({
              'x-auth-token': keyStudent
            })
            .send({
            })
            .expect(400)
        })
    })
    it('POST /student/questionnaire/:id => Try bad update invalid questionId', async () => {
      let keyTeacher
      let keyStudent
      let questionnaireId
      let questionId
      await request(app)
        .post('/user/login')
        .send({
          email: 'teacher1@schood.fr',
          password: 'teacher123'
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
          questionnaireId = await Questionnaire.findOne()
          questionId = questionnaireId.questions[0]._id
          await request(app)
            .post('/user/login')
            .send({
              email: 'student1@schood.fr',
              password: 'student123'
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
                  answer: 'Test'
                }
              ]
            })
            .expect(200)
          await request(app)
            .patch('/student/questionnaire/' + questionnaireId._id)
            .set({
              'x-auth-token': keyStudent
            })
            .send({
              answers: [
                {
                  question: '64f258afe6d3d02761a011ed',
                  answer: 'Test'
                }
              ]
            })
            .expect(400)
        })
    })
  })
})
