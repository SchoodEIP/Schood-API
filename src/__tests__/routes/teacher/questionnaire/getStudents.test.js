const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')
const { Questionnaire } = require('../../../../models/questionnaire')

describe('Teacher Questionnaire route tests', () => {
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

  describe('getStudents route', () => {
    it('GET /teacher/questionnaire/:id => Try good get students from questionnaire', async () => {
      let key
      let questionnaireId
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
          date: new Date().toUTCString(),
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
          questionnaireId = questionnaireId._id
          await request(app)
            .get('/teacher/questionnaire/' + questionnaireId + '/students')
            .set({
              'x-auth-token': key
            })
            .expect(200)
        })
    })
    it('GET /teacher/questionnaire/:id => Try bad get students from questionnaire', async () => {
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
        .get('/teacher/questionnaire/nope/students')
        .set({
          'x-auth-token': key
        })
        .expect(400)
    })
  })
})
