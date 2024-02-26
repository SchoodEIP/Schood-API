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
      const token = await funcs.login('admin.Schood1@schood.fr', 'admin_123')
      funcs.setToken(token)

      let facilty = await funcs.getFacility({name: "Schood1"})
      const facilityId = facilty._id
      await funcs.delete(`/admin/facility/${facilty._id}`, { deletePermanently: true })

      facilty = await funcs.getFacility({name: "Schood1"})
      expect(facilty).toBeNull()
      expect(await funcs.getUser({facility: facilityId})).toBeNull()
      expect(await funcs.getClass({facility: facilityId})).toBeNull()
    })

    it('DELETE /admin/facility/:id => Try delete good request not permanently', async () => {
      const token = await funcs.login('admin.Schood1@schood.fr', 'admin_123')
      funcs.setToken(token)

      let facilty = await funcs.getFacility({name: "Schood1"})
      const facilityId = facilty._id
      await funcs.delete(`/admin/facility/${facilty._id}`, { deletePermanently: false })

      facilty = await funcs.getFacility({name: "Schood1"})
      expect(facilty).not.toBeNull()
      expect(facilty.active).toBeFalsy()

      const user = await funcs.getUser({facility: facilityId})
      expect(user).not.toBeNull()

      const classToCheck = await funcs.getClass({facility: facilityId})
      expect(classToCheck).not.toBeNull()
    })
  })
})
