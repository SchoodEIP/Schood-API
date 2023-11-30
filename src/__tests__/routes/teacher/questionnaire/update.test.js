const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')
const { Questionnaires } = require('../../../../models/questionnaire')

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

  describe('Update route', () => {
    it('PATCH /teacher/questionnaire/:id => Try good update', async () => {
      let key
      let questionnaireId
      const date = new Date()
      date.setDate(date.getDate() + 8)
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
          date: date.toUTCString(),
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
          questionnaireId = questionnaireId._id
          await request(app)
            .patch('/teacher/questionnaire/' + questionnaireId)
            .set({
              'x-auth-token': key
            })
            .send({
              title: 'test',
              questions: [
                {
                  title: 'Question1',
                  type: 'text'
                }
              ]
            })
            .expect(200)
        })
    })
    it('PATCH /teacher/questionnaire/:id => Try good update no title', async () => {
      let key
      let questionnaireId
      const date = new Date()
      date.setDate(date.getDate() + 8)
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
          date: date.toUTCString(),
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
          questionnaireId = questionnaireId._id
          await request(app)
            .patch('/teacher/questionnaire/' + questionnaireId)
            .set({
              'x-auth-token': key
            })
            .send({
              questions: [
                {
                  title: 'Question1',
                  type: 'text'
                }
              ]
            })
            .expect(200)
        })
    })
    it('PATCH /teacher/questionnaire/:id => Try good update no questions', async () => {
      let key
      let questionnaireId
      const date = new Date()
      date.setDate(date.getDate() + 8)
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
          date: date.toUTCString(),
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
          questionnaireId = questionnaireId._id
          await request(app)
            .patch('/teacher/questionnaire/' + questionnaireId)
            .set({
              'x-auth-token': key
            })
            .send({
              title: 'test'
            })
            .expect(200)
        })
    })
    it('POST /teacher/questionnaire => Try bad register', async () => {
      let key
      let questionnaireId
      const date = new Date()
      date.setDate(date.getDate() + 8)
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
          date: date.toUTCString(),
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
          questionnaireId = questionnaireId._id
          await request(app)
            .patch('/teacher/questionnaire/' + questionnaireId)
            .set({
              'x-auth-token': key
            })
            .send({
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
    it('POST /teacher/questionnaire => Try bad register 2', async () => {
      let key
      let questionnaireId
      const date = new Date()
      date.setDate(date.getDate() + 8)
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
          date: date.toUTCString(),
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
          questionnaireId = questionnaireId._id
          await request(app)
            .patch('/teacher/questionnaire/' + questionnaireId)
            .set({
              'x-auth-token': key
            })
            .send({
              questions: [
                {
                  type: 'text'
                }
              ]
            })
            .expect(400)
        })
    })
    it('PATCH /teacher/questionnaire/:id => Try bad update bad date', async () => {
      let key
      let questionnaireId
      const date = new Date()
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
          date: date.toUTCString(),
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
          questionnaireId = questionnaireId._id
          await request(app)
            .patch('/teacher/questionnaire/' + questionnaireId)
            .set({
              'x-auth-token': key
            })
            .send({
              title: 'test',
              questions: [
                {
                  title: 'Question1',
                  type: 'text'
                }
              ]
            })
            .expect(400)
        })
    })
  })
})
