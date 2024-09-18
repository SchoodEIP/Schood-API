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
    it('DELETE /adm/deleteUser/:id => Try delete not permanently', async () => {
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
      expect(user.active).toBeFalsy()
    })

    it('DELETE /adm/deleteUser/:id => Try delete permanently', async () => {
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
      await funcs.delete(`/adm/deleteUser/${user._id}`, bodyDelete)

      user = await funcs.getUser({ email: 'schood.eip@gmail.com' })
      expect(user).toBeNull()
    })

    it('DELETE /adm/deleteUser/:id => Try delete wrong body', async () => {
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
      const bodyDelete = {}

      funcs.setToken(token)
      await funcs.post('/adm/register/?mail=false', bodyRegister)

      let user = await funcs.getUser({ email: 'schood.eip@gmail.com' })
      await funcs.delete(`/adm/deleteUser/${user._id}`, bodyDelete, 400)

      user = await funcs.getUser({ email: 'schood.eip@gmail.com' })
      expect(user).toBeTruthy()
      expect(user.active).toBeTruthy()
    })
  })
})
