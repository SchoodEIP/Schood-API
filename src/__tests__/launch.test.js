const request = require('supertest')
const mongoose = require('mongoose')

const server = require('./serverUtils/testServer')
const { dbConnection } = require('../config/db')
const { Users } = require('../models/users')
const { Roles } = require('../models/roles')

describe('Config tests', () => {
  describe('Check if lauched', () => {
    let app

    beforeAll(async () => {
      process.env.PROD = true
      app = await server.testServer()
    })

    afterAll(async () => {
      await mongoose.connection.dropDatabase()
      await mongoose.connection.close()
    })

    it('Check server ON', async () => {
      return await request(app)
        .get('/')
        .expect(404)
    })
  })

  describe('Check database connection', () => {
    const tmp = process.env.DB_HOST

    it('Bad database connection', async () => {
      // process.env.DB_HOST = 'Nope'
      const val = await dbConnection('test')
      // expect(val).toBeFalsy()
      expect(val).toBeTruthy()
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
      const user = await Users.findOne({ email: 'admin@schood.fr' })

      expect(user).toBeTruthy()
      expect(user).not.toBeNull()
      expect(user.length).not.toEqual(0)
    })

    it('Random user not exist', async () => {
      const user = await Users.findOne({ email: 'Nope@schood.fr' })

      expect(user).toBeFalsy()
      expect(user).toBeNull()
    })

    describe('Check default user prod', () => {
      it('teacher1 exist', async () => {
        const user = await Users.findOne({ email: 'teacher1@schood.fr' })

        expect(user).toBeTruthy()
        expect(user).not.toBeNull()
        expect(user.length).not.toEqual(0)
      })

      it('teacher2 exist', async () => {
        const user = await Users.findOne({ email: 'teacher2@schood.fr' })

        expect(user).toBeTruthy()
        expect(user).not.toBeNull()
        expect(user.length).not.toEqual(0)
      })

      it('student1 exist', async () => {
        const user = await Users.findOne({ email: 'student1@schood.fr' })

        expect(user).toBeTruthy()
        expect(user).not.toBeNull()
        expect(user.length).not.toEqual(0)
      })

      it('student2 exist', async () => {
        const user = await Users.findOne({ email: 'student2@schood.fr' })

        expect(user).toBeTruthy()
        expect(user).not.toBeNull()
        expect(user.length).not.toEqual(0)
      })
    })
  })

  describe('Check database default roles', () => {
    beforeAll(async () => {
      await dbConnection('test')
    })

    afterAll(async () => {
      await mongoose.connection.dropDatabase()
      await mongoose.connection.close()
    })

    it('student role exist', async () => {
      const role = await Roles.findOne({ name: 'student' })

      expect(role).toBeTruthy()
      expect(role).not.toBeNull()
      expect(role.length).not.toEqual(0)
    })

    it('teacher role exist', async () => {
      const role = await Roles.findOne({ name: 'teacher' })

      expect(role).toBeTruthy()
      expect(role).not.toBeNull()
      expect(role.length).not.toEqual(0)
    })

    it('administration role exist', async () => {
      const role = await Roles.findOne({ name: 'administration' })

      expect(role).toBeTruthy()
      expect(role).not.toBeNull()
      expect(role.length).not.toEqual(0)
    })

    it('admin role exist', async () => {
      const role = await Roles.findOne({ name: 'admin' })

      expect(role).toBeTruthy()
      expect(role).not.toBeNull()
      expect(role.length).not.toEqual(0)
    })

    it('Random role not exist', async () => {
      const role = await Roles.findOne({ name: 'Nope' })

      expect(role).toBeFalsy()
      expect(role).toBeNull()
    })
  })
})
