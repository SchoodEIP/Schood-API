const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')
const TestFunctions = require('../../../serverUtils/TestFunctions')
const { Questionnaires } = require('../../../../models/questionnaire')

describe('Shared Questionnaire route tests', () => {
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
    it('POST /shared/statistics/answers => Try good request teacher all', async () => {
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

      funcs.setToken(tokenTeacher)

      const fromDate = new Date(date)
      fromDate.setDate(fromDate.getDate() - fromDate.getDay() + 1)
      fromDate.setUTCHours(0, 0, 0, 0)

      const toDate = new Date(date)
      toDate.setDate(fromDate.getDate() + 6)
      toDate.setUTCHours(23, 59, 59, 59)

      const res = await funcs.post('/shared/statistics/answers', { fromDate, toDate, classFilter: 'all' })

      expect(Object.keys(res).length).toBe(1)
      expect(res[date.toISOString().split('T')[0]]).toBe(100)
    })

    it('POST /shared/statistics/answers => Try good request teacher one class', async () => {
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

      funcs.setToken(tokenTeacher)

      const fromDate = new Date(date)
      fromDate.setDate(fromDate.getDate() - fromDate.getDay() + 1)
      fromDate.setUTCHours(0, 0, 0, 0)

      const toDate = new Date(date)
      toDate.setDate(fromDate.getDate() + 6)
      toDate.setUTCHours(23, 59, 59, 59)

      const _class = (await funcs.getUser({ email: 'alice.johnson.Schood1@schood.fr' })).classes[0]
      const res = await funcs.post('/shared/statistics/answers', { fromDate, toDate, classFilter: _class })

      expect(Object.keys(res).length).toBe(1)
      expect(res[date.toISOString().split('T')[0]]).toBe(100)
    })

    it('POST /shared/statistics/answers => Try good request adm all', async () => {
      const tokenAdm = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
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

      funcs.setToken(tokenAdm)

      const fromDate = new Date(date)
      fromDate.setDate(fromDate.getDate() - fromDate.getDay() + 1)
      fromDate.setUTCHours(0, 0, 0, 0)

      const toDate = new Date(date)
      toDate.setDate(fromDate.getDate() + 6)
      toDate.setUTCHours(23, 59, 59, 59)

      const res = await funcs.post('/shared/statistics/answers', { fromDate, toDate, classFilter: 'all' })

      expect(Object.keys(res).length).toBe(1)
      expect(res[date.toISOString().split('T')[0]]).toBe(100)
    })

    it('POST /shared/statistics/answers => Try good request adm one class', async () => {
      const tokenTeacher = await funcs.login('pierre.dubois.Schood1@schood.fr', 'Pierre_123')
      const tokenAdm = funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
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

      funcs.setToken(await tokenAdm)

      const fromDate = new Date(date)
      fromDate.setDate(fromDate.getDate() - fromDate.getDay() + 1)
      fromDate.setUTCHours(0, 0, 0, 0)

      const toDate = new Date(date)
      toDate.setDate(fromDate.getDate() + 6)
      toDate.setUTCHours(23, 59, 59, 59)

      const _class = (await funcs.getUser({ email: 'alice.johnson.Schood1@schood.fr' })).classes[0]
      const res = await funcs.post('/shared/statistics/answers', { fromDate, toDate, classFilter: _class })

      expect(Object.keys(res).length).toBe(1)
      expect(res[date.toISOString().split('T')[0]]).toBe(100)
    })

    it('POST /shared/statistics/answers => Try good request no answer register', async () => {
      const token = await funcs.login('marie.leclerc.Schood1@schood.fr', 'Marie_123')
      funcs.setToken(token)

      const fromDate = new Date(date)
      fromDate.setDate(fromDate.getDate() - fromDate.getDay() + 1)
      fromDate.setUTCHours(0, 0, 0, 0)

      const toDate = new Date(date)
      toDate.setDate(fromDate.getDate() + 6)
      toDate.setUTCHours(23, 59, 59, 59)

      const res = await funcs.post('/shared/statistics/answers', { fromDate, toDate, classFilter: 'all' })

      expect(Object.keys(res).length).toBe(0)
    })

    it('POST /shared/statistics/answers => Try bad request fromDate missing', async () => {
      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      funcs.setToken(token)

      const toDate = new Date(date)
      toDate.setDate(date.getDate() + 6)
      toDate.setUTCHours(23, 59, 59, 59)

      const res = await funcs.post('/shared/statistics/answers', { toDate, classFilter: 'all' }, 400)

      expect(res.message).toBe('Date range missing')
    })

    it('POST /shared/statistics/answers => Try bad request toDate missing', async () => {
      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      funcs.setToken(token)

      const fromDate = new Date(date)
      fromDate.setDate(date.getDate() + 6)
      fromDate.setUTCHours(23, 59, 59, 59)

      const res = await funcs.post('/shared/statistics/answers', { fromDate, classFilter: 'all' }, 400)

      expect(res.message).toBe('Date range missing')
    })

    it('POST /shared/statistics/answers => Try bad request classFilter missing', async () => {
      const token = await funcs.login('marie.leclerc.Schood1@schood.fr', 'Marie_123')
      funcs.setToken(token)

      const fromDate = new Date(date)
      fromDate.setDate(fromDate.getDate() - fromDate.getDay() + 1)
      fromDate.setUTCHours(0, 0, 0, 0)

      const toDate = new Date(date)
      toDate.setDate(fromDate.getDate() + 6)
      toDate.setUTCHours(23, 59, 59, 59)

      const res = await funcs.post('/shared/statistics/answers', { fromDate, toDate }, 400)

      expect(res.message).toBe('Class filter missing')
    })

    it('POST /shared/statistics/answers => Try bad request wrong classFilter', async () => {
      const token = await funcs.login('marie.leclerc.Schood1@schood.fr', 'Marie_123')
      funcs.setToken(token)

      const fromDate = new Date(date)
      fromDate.setDate(fromDate.getDate() - fromDate.getDay() + 1)
      fromDate.setUTCHours(0, 0, 0, 0)

      const toDate = new Date(date)
      toDate.setDate(fromDate.getDate() + 6)
      toDate.setUTCHours(23, 59, 59, 59)

      const res = await funcs.post('/shared/statistics/answers', {
        fromDate,
        toDate,
        classFilter: '65db3e5682c975c249bd532a'
      }, 400)

      expect(res.message).toBe('Class filtered is not an existing class')
    })

    it('POST /shared/statistics/answers => Try bad request user not part of this class', async () => {
      const token = await funcs.login('marie.leclerc.Schood1@schood.fr', 'Marie_123')
      funcs.setToken(token)

      const _class = (await funcs.getUser({ email: 'pierre.dubois.Schood1@schood.fr' })).classes[1]

      const fromDate = new Date(date)
      fromDate.setDate(fromDate.getDate() - fromDate.getDay() + 1)
      fromDate.setUTCHours(0, 0, 0, 0)

      const toDate = new Date(date)
      toDate.setDate(fromDate.getDate() + 6)
      toDate.setUTCHours(23, 59, 59, 59)

      const res = await funcs.post('/shared/statistics/answers', {
        fromDate,
        toDate,
        classFilter: _class
      }, 400)

      expect(res.message).toBe('User is not part of this class')
    })
  })
})
