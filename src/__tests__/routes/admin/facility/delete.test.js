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
    await dbDefault(true)
  })

  afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
  })

  describe('Delete route', () => {
    it('DELETE /admin/facility/:id => Try delete good request permanently', async () => {
      const token = await funcs.login('admin.Schood1@schood.fr', 'admin_123')
      funcs.setToken(token)

      let facilty = await funcs.getFacility({ name: 'Schood1' })
      expect(facilty).not.toBeNull()
      const id = facilty._id
      await funcs.delete(`/admin/facility/${id}`, { deletePermanently: true })

      facilty = await funcs.getFacility({ _id: id })
      expect(facilty).toBeNull()
      expect(await funcs.getUser({ facility: id })).toBeNull()
      expect(await funcs.getClass({ facility: id })).toBeNull()
    })

    it('DELETE /admin/facility/:id => Try delete good request not permanently', async () => {
      const token = await funcs.login('admin.Schood1@schood.fr', 'admin_123')
      funcs.setToken(token)

      let facilty = await funcs.getFacility({ name: 'Schood1' })
      expect(facilty).not.toBeNull()
      const id = facilty._id
      await funcs.delete(`/admin/facility/${id}`, { deletePermanently: false })

      facilty = await funcs.getFacility({ _id: id })
      expect(facilty).not.toBeNull()
      expect(facilty.active).toBeFalsy()
      expect(await funcs.getUser({ facility: id })).not.toBeNull()
      expect(await funcs.getClass({ facility: id })).not.toBeNull()
    })
  })
})
