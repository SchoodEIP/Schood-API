const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')
const TestFunctions = require('../../../serverUtils/TestFunctions')

describe('Adm route tests', () => {
  let app
  let funcs

  beforeAll(async () => {
    process.env.PROD = false
    app = await server.testServer()
    funcs = new TestFunctions(app)
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
    it('POST /adm/register => Try register good student', async () => {
      const role = await funcs.getRole({ name: 'student' })
      const class_ = await funcs.getClass({ name: '200' })
      const token = await funcs.login('admin.Schood1@schood.fr', 'admin_123')
      const body = {
        email: 'schood.eip@gmail.com',
        firstname: 'studentTest',
        lastname: 'studentTest',
        role: role._id,
        classes: [
          class_._id
        ]
      }

      funcs.setToken(token)
      await funcs.post('/adm/register/?mail=false', body)
    })

    it('POST /adm/register => Try register bad body', async () => {
      const role = await funcs.getRole({ name: 'student' })
      const class_ = await funcs.getClass({ name: '200' })
      const token = await funcs.login('admin.Schood1@schood.fr', 'admin_123')
      const body = {
        email: 'schood.eip@gmail.com',
        lastname: 'studentTest',
        role: role._id,
        classes: [
          class_._id
        ]
      }

      funcs.setToken(token)
      await funcs.post('/adm/register/?mail=false', body, 400, /json/)
    })

    it('POST /adm/register => Try register bad role', async () => {
      const token = await funcs.login('admin.Schood1@schood.fr', 'admin_123')
      const body = {
        email: 'schood.eip@gmail.com',
        firstname: 'studentTest',
        lastname: 'studentTest',
        role: '6460a74d0f190e2de1d22800',
        classes: [
          '6460a74d0f190e2de1d22800'
        ]
      }

      funcs.setToken(token)
      await funcs.post('/adm/register/?mail=false', body, 400, /json/)
    })

    it('POST /adm/register => Try register bad number of classes', async () => {
      const role = await funcs.getRole({ name: 'student' })
      const class1 = await funcs.getClass({ name: '200' })
      const class2 = await funcs.getClass({ name: '201' })
      const token = await funcs.login('admin.Schood1@schood.fr', 'admin_123')
      const body = {
        email: 'schood.eip@gmail.com',
        firstname: 'studentTest',
        lastname: 'studentTest',
        role: role._id,
        classes: [
          class1._id,
          class2._id
        ]
      }

      funcs.setToken(token)
      await funcs.post('/adm/register/?mail=false', body, 400, /json/)
    })

    it('POST /adm/register => Try register bad class', async () => {
      const role = await funcs.getRole({ name: 'student' })
      const token = await funcs.login('admin.Schood1@schood.fr', 'admin_123')
      const body = {
        email: 'schood.eip@gmail.com',
        firstname: 'studentTest',
        lastname: 'studentTest',
        role: role._id,
        classes: [
          '6460a74d0f190e2de1d22800'
        ]
      }

      funcs.setToken(token)
      await funcs.post('/adm/register/?mail=false', body, 400, /json/)
    })

    it('POST /adm/register => Try register bad access level', async () => {
      const role = await funcs.getRole({ name: 'student' })
      const class_ = await funcs.getClass({ name: '200' })
      const token = await funcs.login('alice.johnson.Schood1@schood.fr', 'Alice_123')
      const body = {
        email: 'schood.eip@gmail.com',
        firstname: 'studentTest',
        lastname: 'studentTest',
        role: role._id,
        classes: [
          class_._id
        ]
      }

      funcs.setToken(token)
      await funcs.post('/adm/register/?mail=false', body, 403, /json/)
    })
  })
})
