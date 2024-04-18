const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')
const TestFunctions = require('../../../serverUtils/TestFunctions')

describe('Shared route tests', () => {
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

  describe('Statistics dailyMoods route', () => {
    it('POST /shared/statistics/dailyMoods => Try good request teacher all', async () => {
      const token = await funcs.login('pierre.dubois.Schood1@schood.fr', 'Pierre_123')
      funcs.setToken(token)

      const body = {
        fromDate: '2024-02-18T00:00:00.000Z',
        toDate: '2024-02-26T23:59:59.000Z',
        classFilter: 'all'
      }
      const res = await funcs.post('/shared/statistics/dailyMoods', body)

      expect(Object.keys(res).length).toBe(5)
      expect(res['2024-02-24']).toStrictEqual({ average: 2, moods: [1, 3] })
      expect(res.averagePercentage).toBe(40)
    })

    it('POST /shared/statistics/dailyMoods => Try good request teacher one class', async () => {
      const token = await funcs.login('pierre.dubois.Schood1@schood.fr', 'Pierre_123')
      funcs.setToken(token)

      const _class = (await funcs.getUser({ email: 'pierre.dubois.Schood1@schood.fr' })).classes[0]

      const body = {
        fromDate: '2024-02-18T00:00:00.000Z',
        toDate: '2024-02-26T23:59:59.000Z',
        classFilter: _class
      }
      const res = await funcs.post('/shared/statistics/dailyMoods', body)

      expect(Object.keys(res).length).toBe(5)
      expect(res['2024-02-24']).toStrictEqual({ average: 1, moods: [1] })
      expect(res.averagePercentage).toBe(40)
    })

    it('POST /shared/statistics/dailyMoods => Try good request adm all', async () => {
      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      funcs.setToken(token)

      const body = {
        fromDate: '2024-02-18T00:00:00.000Z',
        toDate: '2024-02-26T23:59:59.000Z',
        classFilter: 'all'
      }
      const res = await funcs.post('/shared/statistics/dailyMoods', body)

      expect(Object.keys(res).length).toBe(5)
      expect(res['2024-02-24']).toStrictEqual({ average: 2, moods: [1, 3] })
      expect(res.averagePercentage).toBe(40)
    })

    it('POST /shared/statistics/dailyMoods => Try good request adm one class', async () => {
      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      funcs.setToken(token)

      const _class = (await funcs.getUser({ email: 'pierre.dubois.Schood1@schood.fr' })).classes[0]

      const body = {
        fromDate: '2024-02-18T00:00:00.000Z',
        toDate: '2024-02-26T23:59:59.000Z',
        classFilter: _class
      }
      const res = await funcs.post('/shared/statistics/dailyMoods', body)

      expect(Object.keys(res).length).toBe(5)
      expect(res['2024-02-24']).toStrictEqual({ average: 1, moods: [1] })
      expect(res.averagePercentage).toBe(40)
    })

    it('POST /shared/statistics/dailyMoods => Try good request no dailyMood register', async () => {
      const token = await funcs.login('marie.leclerc.Schood1@schood.fr', 'Marie_123')
      funcs.setToken(token)

      mongoose.connection.collections.dailymoods.deleteMany()

      const body = {
        fromDate: '2024-02-18T00:00:00.000Z',
        toDate: '2024-02-26T23:59:59.000Z',
        classFilter: 'all'
      }
      const res = await funcs.post('/shared/statistics/dailyMoods', body)

      expect(res.averagePercentage).toBe('NaN')
    })

    it('POST /shared/statistics/dailyMoods => Try bad request fromDate missing', async () => {
      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      funcs.setToken(token)

      const body = {
        toDate: '2024-02-26T23:59:59.000Z',
        classFilter: 'all'
      }
      const res = await funcs.post('/shared/statistics/dailyMoods', body, 400)

      expect(res.message).toBe('Date range missing')
    })

    it('POST /shared/statistics/dailyMoods => Try bad request toDate missing', async () => {
      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      funcs.setToken(token)

      const body = {
        fromDate: '2024-02-26T23:59:59.000Z',
        classFilter: 'all'
      }
      const res = await funcs.post('/shared/statistics/dailyMoods', body, 400)

      expect(res.message).toBe('Date range missing')
    })

    it('POST /shared/statistics/dailyMoods => Try bad request classFilter missing', async () => {
      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      funcs.setToken(token)

      const body = {
        fromDate: '2024-02-26T23:59:59.000Z',
        toDate: '2024-02-26T23:59:59.000Z'
      }
      const res = await funcs.post('/shared/statistics/dailyMoods', body, 400)

      expect(res.message).toBe('Class filter missing')
    })

    it('POST /shared/statistics/dailyMoods => Try bad request wrong classFilter', async () => {
      const token = await funcs.login('jacqueline.delais.Schood1@schood.fr', 'Jacqueline_123')
      funcs.setToken(token)

      const body = {
        fromDate: '2024-02-26T23:59:59.000Z',
        toDate: '2024-02-26T23:59:59.000Z',
        classFilter: '65db3e5682c975c249bd532a'
      }
      const res = await funcs.post('/shared/statistics/dailyMoods', body, 400)

      expect(res.message).toBe('Class filtered is not an existing class')
    })

    it('POST /shared/statistics/dailyMoods => Try bad request user not part of this class', async () => {
      const token = await funcs.login('marie.leclerc.Schood1@schood.fr', 'Marie_123')
      funcs.setToken(token)

      const _class = (await funcs.getUser({ email: 'pierre.dubois.Schood1@schood.fr' })).classes[1]

      const body = {
        fromDate: '2024-02-18T00:00:00.000Z',
        toDate: '2024-02-26T23:59:59.000Z',
        classFilter: _class
      }
      const res = await funcs.post('/shared/statistics/dailyMoods', body, 400)

      expect(res.message).toBe('User is not part of this class')
    })
  })
})
