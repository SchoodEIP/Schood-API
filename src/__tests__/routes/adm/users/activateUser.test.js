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
    it('POST /adm/activateUser/:id => Try activate', async () => {
      const role = await funcs.getRole({ name: 'student' })
      const class_ = await funcs.getClass({ name: '200' })
      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      const bodyRegister = {
        email: 'schood.eip@gmail.com',
        firstname: 'studentTest',
        lastname: 'studentTest',
        role: role._id,
        classes: [
          class_._id
        ]
      }
      const bodyDelete = {
        deletePermanently: false
      }

      funcs.setToken(token)
      await funcs.post('/adm/register/?mail=false', bodyRegister)

      let user = await funcs.getUser({ email: 'schood.eip@gmail.com' })
      await funcs.delete(`/adm/deleteUser/${user._id}`, bodyDelete)

      user = await funcs.getUser({ email: 'schood.eip@gmail.com' })
      expect(user.active).toBe(false)
      await funcs.post(`/adm/activateUser/${user._id}`)

      user = await funcs.getUser({ email: 'schood.eip@gmail.com' })
      expect(user.active).toBe(true)
    })

    it('POST /adm/activateUser/:id => Try activate, user not found', async () => {
      const role = await funcs.getRole({ name: 'student' })
      const class_ = await funcs.getClass({ name: '200' })
      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      const bodyRegister = {
        email: 'schood.eip@gmail.com',
        firstname: 'studentTest',
        lastname: 'studentTest',
        role: role._id,
        classes: [
          class_._id
        ]
      }
      const bodyDelete = {
        deletePermanently: true
      }

      funcs.setToken(token)
      await funcs.post('/adm/register/?mail=false', bodyRegister)

      let user = await funcs.getUser({ email: 'schood.eip@gmail.com' })
      const userId = user._id
      await funcs.delete(`/adm/deleteUser/${userId}`, bodyDelete)

      user = await funcs.getUser({ email: 'schood.eip@gmail.com' })
      expect(user).toBeNull()

      await funcs.post(`/adm/activateUser/${userId}`, {}, 422)
    })

    it('POST /adm/activateUser/:id => Try activate, bad user id', async () => {
      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')

      funcs.setToken(token)
      await funcs.post('/adm/activateUser/oazbjlerbazelr', {}, 400)
    })
  })
})
