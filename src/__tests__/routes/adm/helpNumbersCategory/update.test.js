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
    it('PATCH /adm/helpNumbersCategory/:id => Try update good request', async () => {
      const token = await funcs.login('adm@schood.fr', 'adm123')
      const body = { name: 'test' }

      funcs.setToken(token)
      await funcs.post('/adm/helpNumbersCategory/register', body)

      let helpNumbersCategory = await funcs.getHelpNumberCategory(body)
      expect(helpNumbersCategory).toBeTruthy()
      body.name = 'notTEst'
      await funcs.patch(`/adm/helpNumbersCategory/${helpNumbersCategory._id}`, body)

      helpNumbersCategory = await funcs.getHelpNumberCategory(body)
      expect(helpNumbersCategory.name).toEqual('notTEst')
    })

    it('PATCH /adm/helpNumbersCategory/:id => Try update bad request', async () => {
      const token = await funcs.login('adm@schood.fr', 'adm123')
      const body = { name: 'test' }

      funcs.setToken(token)
      await funcs.post('/adm/helpNumbersCategory/register', body)

      let helpNumbersCategory = await funcs.getHelpNumberCategory(body)
      expect(helpNumbersCategory).toBeTruthy()
      body.name = 'notTEst'
      await funcs.patch('/adm/helpNumbersCategory/64b15338a8c793949de0868a', body, 422)

      helpNumbersCategory = await funcs.getHelpNumberCategory(body)
      expect(helpNumbersCategory).toBeNull()
    })

    it('PATCH /adm/helpNumbersCategory/:id => Try update name already used', async () => {
      const token = await funcs.login('adm@schood.fr', 'adm123')
      const body1 = { name: 'test' }
      const body2 = { name: 'notTest' }

      funcs.setToken(token)
      await funcs.post('/adm/helpNumbersCategory/register', body1)
      await funcs.post('/adm/helpNumbersCategory/register', body2)

      let helpNumbersCategory = await funcs.getHelpNumberCategory(body1)
      expect(helpNumbersCategory).toBeTruthy()
      await funcs.patch(`/adm/helpNumbersCategory/${helpNumbersCategory._id}`, body2, 422)

      helpNumbersCategory = await funcs.getHelpNumberCategory(body1)
      expect(helpNumbersCategory.name).toEqual('test')
    })

    it('PATCH /adm/helpNumbersCategory/:id => Try update invalid body', async () => {
      const token = await funcs.login('adm@schood.fr', 'adm123')
      const body1 = { name: 'test' }
      const body2 = { test: 'notTest' }

      funcs.setToken(token)
      await funcs.post('/adm/helpNumbersCategory/register', body1)

      let helpNumbersCategory = await funcs.getHelpNumberCategory(body1)
      expect(helpNumbersCategory).toBeTruthy()
      await funcs.patch(`/adm/helpNumbersCategory/${helpNumbersCategory._id}`, body2, 400)

      helpNumbersCategory = await funcs.getHelpNumberCategory(body1)
      expect(helpNumbersCategory.name).toEqual('test')
    })
  })
})
