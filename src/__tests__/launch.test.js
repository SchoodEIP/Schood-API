const request = require('supertest')
const mongoose = require('mongoose')

const server = require('./serverUtils/testServer')
const { dbConnection } = require('../config/db')
const { Users } = require('../models/user')

describe('Config tests', () => {
  describe('Check if lauched', () => {
    let app

    beforeAll(async () => {
      app = await server.testServer()
    })

    afterAll(async () => {
      await mongoose.connection.close()
    })
    it('GET /', async () => {
      return await request(app)
        .get('/')
        .expect(404)
    })
  })

  describe('Check database connection', () => {
    const tmp = process.env.DB_HOST

    it('Bad database connection', async () => {
      process.env.DB_HOST = 'Nope'
      const val = await dbConnection('test')
      expect(val).toBeFalsy()
    }, 31000)

    it('Good database connection', async () => {
      process.env.DB_HOST = tmp
      const val = await dbConnection('test')
      expect(val).toBeTruthy()
      await mongoose.connection.dropDatabase()
      await mongoose.connection.close()
    }, 31000)
  })

  describe('Check database default users', () => {
    beforeAll(async () => {
      await dbConnection('test')
    })

    afterAll(async () => {
      await mongoose.connection.dropDatabase()
      await mongoose.connection.close()
    })

    it('admin exist', async () => {
      const user = await Users.findOne({ username: 'admin' })

      console.log(user)
      expect(user).toBeTruthy()
      expect(user).not.toBeNull()
      expect(user.length).not.toEqual(0)
    })

    it('Random user not exist', async () => {
      const user = await Users.findOne({ username: 'Nope' })

      console.log(user)
      expect(user).toBeFalsy()
      expect(user).toBeNull()
    })
  })
})
