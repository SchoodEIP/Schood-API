const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')
const TestFunctions = require('../../../serverUtils/TestFunctions')
const { Questionnaires } = require('../../../../models/questionnaire')

describe('Student statistics route tests', () => {
  let app
  let funcs
  const date = new Date()

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

  describe('questionnairesAnswers route', () => {
    it('POST /student/statistics/answers => Try good request', async () => {
      const tokenTeacher = await funcs.login('pierre.dubois.Schood1@schood.fr', 'Pierre_123')
      const tokenStudent = funcs.login('alice.johnson.Schood1@schood.fr', 'Alice_123')
      funcs.setToken(tokenTeacher)

      await funcs.post('/teacher/questionnaire', {
        title: 'test',
        date,
        questions: [{ title: 'Question1', type: 'text' }]
      })

      const questionnaireId = await Questionnaires.findOne({ title: 'test' })
      const questionId = questionnaireId.questions[0]._id
      funcs.setToken(await tokenStudent)
      await funcs.post('/student/questionnaire/' + questionnaireId._id, {
        answers: [{ question: questionId, answers: ['Test'] }]
      })

      const fromDate = new Date(date)
      fromDate.setDate(fromDate.getDate() - fromDate.getDay() + 1)
      fromDate.setUTCHours(0, 0, 0, 0)

      const toDate = new Date(date)
      toDate.setDate(fromDate.getDate() + 6)
      toDate.setUTCHours(23, 59, 59, 59)

      const res = await funcs.post('/student/statistics/answers', { fromDate, toDate })

      expect(Object.keys(res).length).toBe(1)
      expect(res[date.toISOString().split('T')[0]]).toBe(100)
    })

    it('POST /student/statistics/answers => Try good request no answer register', async () => {
      const tokenStudent = await funcs.login('alice.johnson.Schood1@schood.fr', 'Alice_123')
      funcs.setToken(tokenStudent)

      const fromDate = new Date(date)
      fromDate.setDate(fromDate.getDate() - fromDate.getDay() + 1)
      fromDate.setUTCHours(0, 0, 0, 0)

      const toDate = new Date(date)
      toDate.setDate(fromDate.getDate() + 6)
      toDate.setUTCHours(23, 59, 59, 59)

      const res = await funcs.post('/student/statistics/answers', { fromDate, toDate })

      expect(Object.keys(res).length).toBe(0)
    })

    it('POST /student/statistics/answers => Try bad request fromDate missing', async () => {
      const tokenStudent = await funcs.login('alice.johnson.Schood1@schood.fr', 'Alice_123')
      funcs.setToken(tokenStudent)

      const toDate = new Date(date)
      toDate.setDate(date.getDate() + 6)
      toDate.setUTCHours(23, 59, 59, 59)

      const res = await funcs.post('/student/statistics/answers', { toDate }, 400)

      expect(res.message).toBe('Date range missing')
    })

    it('POST /student/statistics/answers => Try bad request toDate missing', async () => {
      const tokenStudent = await funcs.login('alice.johnson.Schood1@schood.fr', 'Alice_123')
      funcs.setToken(tokenStudent)

      const fromDate = new Date(date)
      fromDate.setDate(date.getDate() + 6)
      fromDate.setUTCHours(23, 59, 59, 59)

      const res = await funcs.post('/student/statistics/answers', { fromDate }, 400)

      expect(res.message).toBe('Date range missing')
    })

    it('POST /student/statistics/answers => Try bad request user does not belong to any class', async () => {
      const student = await funcs.getUser({ email: 'alice.johnson.Schood1@schood.fr' })
      student.classes = []
      await student.save()

      const tokenStudent = await funcs.login('alice.johnson.Schood1@schood.fr', 'Alice_123')
      funcs.setToken(tokenStudent)

      const fromDate = new Date(date)
      fromDate.setDate(fromDate.getDate() - fromDate.getDay() + 1)
      fromDate.setUTCHours(0, 0, 0, 0)

      const toDate = new Date(date)
      toDate.setDate(fromDate.getDate() + 6)
      toDate.setUTCHours(23, 59, 59, 59)

      const res = await funcs.post('/student/statistics/answers', { fromDate, toDate }, 422)

      expect(res.message).toBe('User does not belongs to any class')
    })
  })
})
