const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../serverUtils/testServer')
const dbDefault = require('../../../config/db.default')
const { Roles } = require('../../../models/roles')
const { Classes } = require('../../../models/classes')

describe('Adm route tests', () => {
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
    it('POST /adm/register => Try register good student', async () => {
      let key
      const role = await Roles.findOne({ name: 'student' })
      const class_ = await Classes.findOne({ name: '200' })

      await request(app)
        .post('/user/login')
        .send({
          email: 'admin@schood.fr',
          password: 'admin123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })
      return await request(app)
        .post('/adm/register/?mail=false')
        .set({
          'x-auth-token': key
        })
        .send({
          email: 'schood.eip@gmail.com',
          firstname: 'studentTest',
          lastname: 'studentTest',
          role: role._id,
          classes: [
            class_._id
          ]
        })
        .expect(200)
    })

    it('POST /adm/register => Try register bad body', async () => {
      let key
      const role = await Roles.findOne({ name: 'student' })
      const class_ = await Classes.findOne({ name: '200' })

      await request(app)
        .post('/user/login')
        .send({
          email: 'admin@schood.fr',
          password: 'admin123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })
      return await request(app)
        .post('/adm/register/?mail=false')
        .set({
          'x-auth-token': key
        })
        .send({
          email: 'schood.eip@gmail.com',
          lastname: 'studentTest',
          role: role._id,
          classes: [
            class_._id
          ]
        })
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('POST /adm/register => Try register bad role', async () => {
      let key

      await request(app)
        .post('/user/login')
        .send({
          email: 'admin@schood.fr',
          password: 'admin123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })
      return await request(app)
        .post('/adm/register/?mail=false')
        .set({
          'x-auth-token': key
        })
        .send({
          email: 'schood.eip@gmail.com',
          firstname: 'studentTest',
          lastname: 'studentTest',
          role: '6460a74d0f190e2de1d22800',
          classes: [
            '6460a74d0f190e2de1d22800'
          ]
        })
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('POST /adm/register => Try register bad number of classes', async () => {
      let key
      const role = await Roles.findOne({ name: 'student' })
      const class1 = await Classes.findOne({ name: '200' })
      const class2 = await Classes.findOne({ name: '201' })

      await request(app)
        .post('/user/login')
        .send({
          email: 'admin@schood.fr',
          password: 'admin123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })
      return await request(app)
        .post('/adm/register/?mail=false')
        .set({
          'x-auth-token': key
        })
        .send({
          email: 'schood.eip@gmail.com',
          firstname: 'studentTest',
          lastname: 'studentTest',
          role: role._id,
          classes: [
            class1._id,
            class2._id
          ]
        })
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('POST /adm/register => Try register bad class', async () => {
      let key
      const role = await Roles.findOne({ name: 'student' })

      await request(app)
        .post('/user/login')
        .send({
          email: 'admin@schood.fr',
          password: 'admin123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })
      return await request(app)
        .post('/adm/register/?mail=false')
        .set({
          'x-auth-token': key
        })
        .send({
          email: 'schood.eip@gmail.com',
          firstname: 'studentTest',
          lastname: 'studentTest',
          role: role._id,
          classes: [
            '6460a74d0f190e2de1d22800'
          ]
        })
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('POST /adm/register => Try register bad access level', async () => {
      let key
      const role = await Roles.findOne({ name: 'student' })
      const class1 = await Classes.findOne({ name: '200' })

      await request(app)
        .post('/user/login')
        .send({
          email: 'student1@schood.fr',
          password: 'student123'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          key = response.body.token
        })
      return await request(app)
        .post('/adm/register/?mail=false')
        .set({
          'x-auth-token': key
        })
        .send({
          email: 'schood.eip@gmail.com',
          firstname: 'studentTest',
          lastname: 'studentTest',
          role: role._id,
          classes: [
            class1._id
          ]
        })
        .expect('Content-Type', /json/)
        .expect(403)
    })
  })
})
