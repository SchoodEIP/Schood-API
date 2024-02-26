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
    await dbDefault()
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
  })

  describe('Register route', () => {
    it('DELETE /adm/classes/:id => Try delete good request', async () => {
      const token = await funcs.login('admin.Schood1@schood.fr', 'admin_123')
      let teacher1 = await funcs.getUser({ name: 'teacher1' })
      let teacher2 = await funcs.getUser({ name: 'teacher2' })
      funcs.setToken(token)

      await funcs.post('/adm/classes/register', { name: 'testClass' })
      let testClass = await funcs.getClass({ name: 'testClass' })
      const classId = testClass._id

      const body1 = {
        role: teacher1.role,
        email: teacher1.email,
        firstname: teacher1.firstname,
        lastname: teacher1.lastname,
        classes: [...teacher1.classes, testClass._id]
      }
      const body2 = {
        role: teacher2.role,
        email: teacher2.email,
        firstname: teacher2.firstname,
        lastname: teacher2.lastname,
        classes: [...teacher2.classes, testClass._id]
      }
      await funcs.patch(`/user/${teacher1._id}`, body1)
      await funcs.patch(`/user/${teacher2._id}`, body2)

      await funcs.delete(`/adm/classes/${testClass._id}`)
      testClass = await funcs.getClass({ name: 'testClass' })

      teacher1 = await funcs.getUser({ name: 'teacher1' })
      teacher2 = await funcs.getUser({ name: 'teacher2' })
      expect(teacher1.classes).not.toContain(classId)
      expect(teacher2.classes).not.toContain(classId)
      expect(testClass).toBeNull()
    })
  })
})
