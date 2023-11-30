const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')
const { Questionnaire } = require('../../../../models/questionnaire')
const { Users } = require('../../../../models/users')
const { Roles } = require('../../../../models/roles')

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
    await dbDefault(true)
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
  })

  describe('getAnswersFromStudent route', () => {
    it('GET /teacher/questionnaire/:id/answers/:id => Try good get students from questionnaire', async () => {
      let key
      let questionnaireId
      let studentId
      let role
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
          role = await Roles.findOne({ name: 'student' })
          studentId = await Users.findOne({ role: role._id })
          await request(app)
            .get('/teacher/questionnaire/' + questionnaireId + '/answers/' + studentId._id)
            .set({
              'x-auth-token': key
            })
            .expect(200)
        })
    })
    it('GET /teacher/questionnaire/:id/answers/:id => Try bad get student answer from questionnaire', async () => {
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
        .get('/teacher/questionnaire/nope/answers/nope')
        .set({
          'x-auth-token': key
        })
        .expect(400)
    })
  })
})
