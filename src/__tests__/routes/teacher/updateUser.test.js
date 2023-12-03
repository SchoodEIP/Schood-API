const request = require('supertest')
const mongoose = require('mongoose')

const server = require('../../serverUtils/testServer')
const dbDefault = require('../../../config/db.default')
const { Roles } = require('../../../models/roles')
const { Classes } = require('../../../models/classes')
const { Users } = require('../../../models/users')

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
    it('PATCH /user/:id => Try update user good student', async () => {
      let key
      const roleStudent = await Roles.findOne({ name: 'student' })
      const roleTeacher = await Roles.findOne({ name: 'teacher' })
      const class200 = await Classes.findOne({ name: '200' })
      const class201 = await Classes.findOne({ name: '201' })

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
      await request(app)
        .post('/adm/register/?mail=false')
        .set({
          'x-auth-token': key
        })
        .send({
          email: 'schood.eip@gmail.com',
          firstname: 'studentTest',
          lastname: 'studentTest',
          role: roleStudent._id,
          classes: [
            class200._id
          ]
        })
        .expect(200)

      const user = await Users.findOne({ email: 'schood.eip@gmail.com' })
      return request(app)
        .patch(`/user/${user._id}`)
        .set({
          'x-auth-token': key
        })
        .send({
          email: 'schood.eip@gmail.cooom',
          firstname: 'studentTesttt',
          lastname: 'studentTesttt',
          role: roleTeacher._id,
          classes: [
            class200._id,
            class201._id
          ]
        })
        .expect(200)
    })

    it('PATCH /user/:id => Try update user bad body', async () => {
      let key
      const roleStudent = await Roles.findOne({ name: 'student' })
      const class200 = await Classes.findOne({ name: '200' })

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
      await request(app)
        .post('/adm/register/?mail=false')
        .set({
          'x-auth-token': key
        })
        .send({
          email: 'schood.eip@gmail.com',
          firstname: 'studentTest',
          lastname: 'studentTest',
          role: roleStudent._id,
          classes: [
            class200._id
          ]
        })
        .expect(200)

      const user = await Users.findOne({ email: 'schood.eip@gmail.com' })
      return request(app)
        .patch(`/user/${user._id}`)
        .set({
          'x-auth-token': key
        })
        .send({
          email: 'schood.eip@gmail.com',
          lastname: 'studentTest',
          role: roleStudent._id,
          classes: [
            class200._id
          ]
        })
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('PATCH /user/:id => Try update user bad role', async () => {
      let key
      const roleStudent = await Roles.findOne({ name: 'student' })
      const class200 = await Classes.findOne({ name: '200' })

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
      await request(app)
        .post('/adm/register/?mail=false')
        .set({
          'x-auth-token': key
        })
        .send({
          email: 'schood.eip@gmail.com',
          firstname: 'studentTest',
          lastname: 'studentTest',
          role: roleStudent._id,
          classes: [
            class200._id
          ]
        })
        .expect(200)

      const user = await Users.findOne({ email: 'schood.eip@gmail.com' })
      return request(app)
        .patch(`/user/${user._id}`)
        .set({
          'x-auth-token': key
        })
        .send({
          email: 'schood.eip@gmail.com',
          lastname: 'studentTest',
          role: '6460a74d0f190e2de1d22800',
          classes: [
            class200._id
          ]
        })
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('PATCH /user/:id => Try update user bad number of classes', async () => {
      let key
      const roleStudent = await Roles.findOne({ name: 'student' })
      const class200 = await Classes.findOne({ name: '200' })
      const class201 = await Classes.findOne({ name: '201' })

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
      await request(app)
        .post('/adm/register/?mail=false')
        .set({
          'x-auth-token': key
        })
        .send({
          email: 'schood.eip@gmail.com',
          firstname: 'studentTest',
          lastname: 'studentTest',
          role: roleStudent._id,
          classes: [
            class200._id
          ]
        })
        .expect(200)

      const user = await Users.findOne({ email: 'schood.eip@gmail.com' })
      return request(app)
        .patch(`/user/${user._id}`)
        .set({
          'x-auth-token': key
        })
        .send({
          email: 'schood.eip@gmail.com',
          lastname: 'studentTest',
          role: roleStudent._id,
          classes: [
            class200._id,
            class201._id
          ]
        })
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('PATCH /user/:id => Try update user bad class', async () => {
      let key
      const roleStudent = await Roles.findOne({ name: 'student' })
      const class200 = await Classes.findOne({ name: '200' })

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
      await request(app)
        .post('/adm/register/?mail=false')
        .set({
          'x-auth-token': key
        })
        .send({
          email: 'schood.eip@gmail.com',
          firstname: 'studentTest',
          lastname: 'studentTest',
          role: roleStudent._id,
          classes: [
            class200._id
          ]
        })
        .expect(200)

      const user = await Users.findOne({ email: 'schood.eip@gmail.com' })
      return request(app)
        .patch(`/user/${user._id}`)
        .set({
          'x-auth-token': key
        })
        .send({
          email: 'schood.eip@gmail.com',
          lastname: 'studentTest',
          role: roleStudent._id,
          classes: [
            '6460a74d0f190e2de1d22800'
          ]
        })
        .expect('Content-Type', /json/)
        .expect(400)
    })

    it('PATCH /user/:id => Try update user bad class', async () => {
      let key
      const roleStudent = await Roles.findOne({ name: 'student' })
      const class200 = await Classes.findOne({ name: '200' })

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
      await request(app)
        .post('/adm/register/?mail=false')
        .set({
          'x-auth-token': key
        })
        .send({
          email: 'schood.eip@gmail.com',
          firstname: 'studentTest',
          lastname: 'studentTest',
          role: roleStudent._id,
          classes: [
            class200._id
          ]
        })
        .expect(200)

      const user = await Users.findOne({ email: 'schood.eip@gmail.com' })
      return request(app)
        .patch(`/user/${user._id}`)
        .set({
          'x-auth-token': key
        })
        .send({
          email: 'schood.eip@gmail.com',
          lastname: 'studentTest',
          role: roleStudent._id,
          classes: [
            '6460a74d0f190e2de1d22800'
          ]
        })
        .expect('Content-Type', /json/)
        .expect(400)
    })
  })
})
