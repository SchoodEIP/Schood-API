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
    it('PATCH /adm/classes/:id/updateStudent => Try update good class', async () => {
      const facility = await funcs.getFacility({ name: 'Schood1' })
      const studentRole = await funcs.getRole({ name: 'student' })
      const class200 = await funcs.getClass({ name: '200', facility: facility._id })
      const class201 = await funcs.getClass({ name: '201', facility: facility._id })
      let student = await funcs.getUser({ classes: { $in: class200._id }, role: studentRole._id })

      expect(student.classes.includes(class200._id)).toBe(true)

      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      funcs.setToken(token)

      await funcs.patch(`/adm/classes/${class201._id}/updateStudent`, { studentId: student._id })
      student = await funcs.getUser({ _id: student._id })
      expect(student.classes.includes(class200._id)).toBe(false)
      expect(student.classes.includes(class201._id)).toBe(true)
    })

    it('PATCH /adm/classes/:id/updateStudent => Try update bad body', async () => {
      const facility = await funcs.getFacility({ name: 'Schood1' })
      const class200 = await funcs.getClass({ name: '200', facility: facility._id })

      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      funcs.setToken(token)

      await funcs.patch(`/adm/classes/${class200._id}/updateStudent`, { }, 400)
    })

    it('PATCH /adm/classes/:id/updateStudent => Try update bad id', async () => {
      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      funcs.setToken(token)

      await funcs.patch('/adm/classes/test/updateStudent', { }, 400)
    })

    it('PATCH /adm/classes/:id/updateStudent => Try update wrong student id', async () => {
      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      const facility = await funcs.getFacility({ name: 'Schood1' })
      const class200 = await funcs.getClass({ name: '200', facility: facility._id })
      funcs.setToken(token)

      await funcs.patch(`/adm/classes/${class200._id}/updateStudent`, { studentId: '65db3e5682c975c249bd532a' }, 422)
    })

    it('PATCH /adm/classes/:id/updateStudent => Try update wrong class id', async () => {
      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      funcs.setToken(token)

      await funcs.patch('/adm/classes/65db3e5682c975c249bd532a/updateStudent', { studentId: '' }, 400)
    })

    it('PATCH /adm/classes/:id/updateStudent => Try update bad user not student', async () => {
      const facility = await funcs.getFacility({ name: 'Schood1' })
      const teacherRole = await funcs.getRole({ name: 'teacher' })
      const class200 = await funcs.getClass({ name: '200', facility: facility._id })
      const teacher = await funcs.getUser({ classes: { $in: class200._id }, role: teacherRole._id })

      expect(teacher.classes.includes(class200._id)).toBe(true)

      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      funcs.setToken(token)

      await funcs.patch(`/adm/classes/${class200._id}/updateStudent`, { studentId: teacher._id }, 422)
    })

    it('PATCH /adm/classes/:id/updateStudent => Try update bad user already in class', async () => {
      const facility = await funcs.getFacility({ name: 'Schood1' })
      const teacherRole = await funcs.getRole({ name: 'teacher' })
      const class200 = await funcs.getClass({ name: '200', facility: facility._id })
      const teacher = await funcs.getUser({ classes: { $in: class200._id }, role: teacherRole._id })

      expect(teacher.classes.includes(class200._id)).toBe(true)

      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      funcs.setToken(token)

      await funcs.patch(`/adm/classes/${class200._id}/updateStudent`, { studentId: teacher._id }, 422)
    })
  })
})
