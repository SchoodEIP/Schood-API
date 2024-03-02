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
      const facility = await funcs.getFacility({ name: 'Schood1' })
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

    it('POST /adm/classes/register => Try update bad body', async () => {
      const facility = await funcs.getFacility({ name: 'Schood1' })
      const class200 = await funcs.getClass({ name: '200', facility: facility._id })

      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      funcs.setToken(token)

      await funcs.patch(`/adm/classes/${class200._id}/addTeacher`, { }, 400)
    })

    it('POST /adm/classes/register => Try update bad id', async () => {
      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      funcs.setToken(token)

      await funcs.patch('/adm/classes/test/addTeacher', { }, 400)
    })

    it('POST /adm/classes/register => Try update wrong class', async () => {
      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      funcs.setToken(token)

      await funcs.patch('/adm/classes/65db3e5682c975c249bd532a/addTeacher', { teacherId: '65db3e5682c975c249bd532a' }, 422)
    })

    it('POST /adm/classes/register => Try update bad user not teacher', async () => {
      const facility = await funcs.getFacility({ name: 'Schood1' })
      const studentRole = await funcs.getRole({ name: 'student' })
      const class200 = await funcs.getClass({ name: '200', facility: facility._id })
      const teacher = await funcs.getUser({ classes: { $in: class200._id }, role: studentRole._id })

      expect(teacher.classes.includes(class200._id)).toBe(true)

      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      funcs.setToken(token)

      await funcs.patch(`/adm/classes/${class200._id}/addTeacher`, { teacherId: teacher._id }, 422)
    })

    it('POST /adm/classes/register => Try update bad user already in class', async () => {
      const facility = await funcs.getFacility({ name: 'Schood1' })
      const teacherRole = await funcs.getRole({ name: 'teacher' })
      const class200 = await funcs.getClass({ name: '200', facility: facility._id })
      const teacher = await funcs.getUser({ classes: { $in: class200._id }, role: teacherRole._id })

      expect(teacher.classes.includes(class200._id)).toBe(true)

      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      funcs.setToken(token)

      await funcs.patch(`/adm/classes/${class200._id}/addTeacher`, { teacherId: teacher._id }, 422)
    })
  })
})
