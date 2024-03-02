const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')
const { Users } = require('../../../../models/users')
const { DailyMoods } = require('../../../../models/dailyMoods')

describe('Teacher DailyMood route tests', () => {
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

  describe('getClassMood route', () => {
    it('GET /teacher/dailyMood/:id/ => Try good get dailyMood from class', async () => {
      let key
      let key2
      await request(app)
        .post('/user/login')
        .send({
          email: 'alice.johnson.Schood1@schood.fr',
          password: 'Alice_123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key2 = response.body.token
        })

      await request(app)
        .post('/student/dailyMood/')
        .set({
          'x-auth-token': key2
        })
        .send({
          mood: 1
        })
        .expect(200)
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

      const user = await Users.findOne({ email: 'pierre.dubois.Schood1@schood.fr' })

      await request(app)
        .get('/teacher/dailyMood/' + user.classes[0])
        .set({
          'x-auth-token': key
        })
        .expect(200)
    })
    it('GET /teacher/dailyMood/:id/ => Try good get dailyMood from class no mood', async () => {
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

      await DailyMoods.deleteMany({})
      const user = await Users.findOne({ email: 'pierre.dubois.Schood1@schood.fr' })

      await request(app)
        .get('/teacher/dailyMood/' + user.classes[0])
        .set({
          'x-auth-token': key
        })
        .expect(200)
    })
  })
})
