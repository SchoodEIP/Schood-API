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

  describe('Patch route', () => {
    it('PATCH /admin/facility/:id => Try update bad request', async () => {
      const token = await funcs.login('admin.Schood1@schood.fr', 'admin_123')
      funcs.setToken(token)

      await funcs.patch('/admin/facility/00aaa00000a000aa0a0a0000', {}, 404)
    })

    it('PATCH /admin/facility/:id => Try update good request', async () => {
      const token = await funcs.login('admin.Schood1@schood.fr', 'admin_123')
      funcs.setToken(token)

      let facilty = await funcs.getFacility({ name: 'Schood1' })
      expect(facilty).not.toBeNull()
      const id = facilty._id
      await funcs.patch(`/admin/facility/${id}`, { name: 'Test' })

      facilty = await funcs.getFacility({ _id: id })
      expect(facilty).not.toBeNull()
      expect(facilty.name).toBe('Test')
    })
  })
})
