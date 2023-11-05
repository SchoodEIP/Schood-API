const request = require('supertest')
const { Classes } = require('../../models/classes')
const { Roles } = require('../../models/roles')
const { Answers } = require('../../models/answers')
const { Chats } = require('../../models/chat')
const { Facilities } = require('../../models/facilities')
const { Files } = require('../../models/file')
const { HelpNumbers } = require('../../models/helpNumbers')
const { HelpNumbersCategories } = require('../../models/helpNumbersCategories')
const { Messages } = require('../../models/message')
const { Questionnaires } = require('../../models/questionnaire')
const { Users } = require('../../models/users')

module.exports = class TestFunctions {
  token
  constructor (app) {
    this.app = app
  }

  async login (email, password) {
    let token

    await request(this.app)
      .post('/user/login')
      .send({
        email,
        password
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        token = response.body.token
      })
    return token
  }

  setToken (token) {
    this.token = token
  }

  get getToken () {
    return this.token
  }

  async get (route, expectedCode = 200, token = null, contentType = /json/, toExecute = null) {
    let res

    await request(this.app)
      .get(route)
      .set({
        'x-auth-token': token || this.token
      })
      .expect(expectedCode)
      .expect('Content-Type', contentType)
      .then((response) => {
        res = response.body
        if (toExecute) toExecute(response)
      })
    return res
  }

  async post (route, body = {}, expectedCode = 200, token = null, contentType = /json/, toExecute = null) {
    let res

    await request(this.app)
      .post(route)
      .set({
        'x-auth-token': token || this.token
      })
      .send(body)
      .expect('Content-Type', contentType)
      .expect(expectedCode)
      .then((response) => {
        res = response.body
        if (toExecute) toExecute(response)
      })
    return res
  }

  async patch (route, body = {}, expectedCode = 200, token = null, contentType = /json/, toExecute = null) {
    let res

    await request(this.app)
      .patch(route)
      .set({
        'x-auth-token': token || this.token
      })
      .send(body)
      .expect('Content-Type', contentType)
      .expect(expectedCode)
      .then((response) => {
        res = response.body
        if (toExecute) toExecute(response)
      })
    return res
  }

  async delete (route, expectedCode = 200, token = null, contentType = /json/, toExecute = null) {
    let res

    await request(this.app)
      .delete(route)
      .set({
        'x-auth-token': token || this.token
      })
      .expect('Content-Type', contentType)
      .expect(expectedCode)
      .then((response) => {
        res = response.body
        if (toExecute) toExecute(response)
      })
    return res
  }

  async getClass (filter) {
    return Classes.findOne(filter)
  }

  async getRole (filter) {
    return Roles.findOne(filter)
  }

  async getAnswer (filter) {
    return Answers.findOne(filter)
  }

  async getChat (filter) {
    return Chats.findOne(filter)
  }

  async getFacilities (filter) {
    return Facilities.findOne(filter)
  }

  async getFile (filter) {
    return Files.findOne(filter)
  }

  async getHelpNumber (filter) {
    return HelpNumbers.findOne(filter)
  }

  async getHelpNumberCategory (filter) {
    return HelpNumbersCategories.findOne(filter)
  }

  async getMessage (filter) {
    return Messages.findOne(filter)
  }

  async getQuestionnaire (filter) {
    return Questionnaires.findOne(filter)
  }

  async getUser (filter) {
    return Users.findOne(filter)
  }
}
