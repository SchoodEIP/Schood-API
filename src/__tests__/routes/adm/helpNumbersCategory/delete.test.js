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

  describe('Delete route', () => {
    it('DELETE /adm/helpNumbersCategory/:id => Try delete good request', async () => {
      const token = await funcs.login('admin.Schood1@schood.fr', 'admin_123')
      funcs.setToken(token)

      await funcs.post('/adm/helpNumbersCategory/register', { name: 'testCategory' })
      const helpNumbersCategory = await funcs.getHelpNumberCategory({ name: 'testCategory' })

      const body = {
        name: 'test',
        telephone: '0102030405',
        email: 'test.mail@gmail.com',
        helpNumbersCategory: helpNumbersCategory._id,
        description: 'Random description'
      }
      await funcs.post('/adm/helpNumber/register', body)

      let helpNumber = await funcs.getHelpNumber({ name: 'test' })
      expect(helpNumber.helpNumbersCategory).toEqual(helpNumbersCategory._id)

      await funcs.delete(`/adm/helpNumbersCategory/${helpNumbersCategory._id}`)

      const defaultCat = await funcs.getHelpNumberCategory({ name: 'Default' })
      helpNumber = await funcs.getHelpNumber({ name: 'test' })
      expect(helpNumber.helpNumbersCategory).not.toEqual(helpNumbersCategory._id)
      expect(defaultCat).not.toBeNull()
      expect(helpNumber.helpNumbersCategory).toEqual(defaultCat._id)
    })
  })
})
