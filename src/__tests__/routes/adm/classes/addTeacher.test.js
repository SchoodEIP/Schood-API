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
    it('POST /adm/classes/register => Try update good class', async () => {
      const facility = await funcs.getFacility({})
      const teacherRole = await funcs.getRole({ name: 'teacher' })
      const class200 = await funcs.getClass({ name: '200', facility: facility._id })
      let teacher = await funcs.getUser({ classes: { $in: class200._id }, role: teacherRole._id })

      expect(teacher.classes.includes(class200._id)).toBe(true)

      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      funcs.setToken(token)

      await funcs.patch(`/adm/classes/${class200._id}/removeTeacher`, { teacherId: teacher._id })
      teacher = await funcs.getUser({ _id: teacher._id })
      expect(teacher.classes.includes(class200._id)).toBe(false)

      await funcs.patch(`/adm/classes/${class200._id}/addTeacher`, { teacherId: teacher._id })
      teacher = await funcs.getUser({ _id: teacher._id })
      expect(teacher.classes.includes(class200._id)).toBe(true)
    })
  })
})
