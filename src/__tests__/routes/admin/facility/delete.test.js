const mongoose = require('mongoose')

const server = require('../../../serverUtils/testServer')
const dbDefault = require('../../../../config/db.default')
const TestFunctions = require('../../../serverUtils/TestFunctions')

describe('Admin route tests', () => {
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
    it('DELETE /admin/facility/:id => Try delete good request permanently', async () => {
      const token = await funcs.login('admin@schood.fr', 'admin123')
      funcs.setToken(token)

      let facilty = await funcs.getFacility({})
      await funcs.delete(`/admin/facility/${facilty._id}`, { deletePermanently: true })

      facilty = await funcs.getFacility({})
      expect(facilty).toBeNull()
      expect(await funcs.getUser({})).toBeNull()
      expect(await funcs.getClass({})).toBeNull()
    })

    it('DELETE /admin/facility/:id => Try delete good request not permanently', async () => {
      const token = await funcs.login('admin@schood.fr', 'admin123')
      funcs.setToken(token)

      let facilty = await funcs.getFacility({})
      await funcs.delete(`/admin/facility/${facilty._id}`, { deletePermanently: false })

      facilty = await funcs.getFacility({})
      expect(facilty).not.toBeNull()
      expect(facilty.active).toBeFalsy()

      const user = await funcs.getUser({})
      expect(user).not.toBeNull()

      const classToCheck = await funcs.getClass({})
      expect(classToCheck).not.toBeNull()
    })
  })
})
