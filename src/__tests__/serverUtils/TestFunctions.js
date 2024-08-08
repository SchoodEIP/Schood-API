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
const { Moods } = require('../../models/moods')

module.exports = class TestFunctions {
  token
  app
  wrongId
  constructor (app) {
    this.app = app
    this.wrongId = '000000a00aa00a00aa0a0000'
  }

  /**
   * Function to log in as a user
   * @param {String} email
   * @param {String} password
   * @returns {String} Token of the user connected
   */
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

  /**
   * Function to set the token for following function calls
   * @param {String} token
   */
  setToken (token) {
    this.token = token
  }

  /**
   * Function to get the token currently set
   * @returns {String}
   */
  get getToken () {
    return this.token
  }

  /**
   * Function to execute GET method
   * @param {String} route The route for API call
   * @param {Number} expectedCode The expected return code of API call, default 200
   * @param {RegExp} contentType The expected type of content returned by the API call. If null, not checked, default null
   * @param {String} token The token applied to the API call. If not defined, this.token will be applied, default null
   * @param {Function} toExecute Function to execute after API call ended. Takes all the response as parameter, default null
   * @returns {JSON} The body of the response of the API call
   */
  async get (route, expectedCode = 200, contentType = /json/, token = null, toExecute = null) {
    let res

    if (contentType) {
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
    } else {
      await request(this.app)
        .get(route)
        .set({
          'x-auth-token': token || this.token
        })
        .expect(expectedCode)
        .then((response) => {
          res = response.body
          if (toExecute) toExecute(response)
        })
    }
    return res
  }

  /**
   * Function to execute POST method
   * @param {String} route The route for API call
   * @param {Object} body The body of the API call, default {}
   * @param {Number} expectedCode The expected return code of API call, default 200
   * @param {RegExp} contentType The expected type of content returned by the API call. If null, not checked, default null
   * @param {String} token The token applied to the API call. If not defined, this.token will be applied, default null
   * @param {Function} toExecute Function to execute after API call ended. Takes all the response as parameter, default null
   * @returns {JSON} The body of the response of the API call
   */
  async post (route, body = {}, expectedCode = 200, contentType = null, token = null, toExecute = null) {
    let res

    if (contentType) {
      await request(this.app)
        .post(route)
        .set({
          'x-auth-token': token || this.token
        })
        .send(body)
        .expect(expectedCode)
        .expect('Content-Type', contentType)
        .then((response) => {
          res = response.body
          if (toExecute) toExecute(response)
        })
    } else {
      await request(this.app)
        .post(route)
        .set({
          'x-auth-token': token || this.token
        })
        .send(body)
        .expect(expectedCode)
        .then((response) => {
          res = response.body
          if (toExecute) toExecute(response)
        })
    }
    return res
  }

  /**
   * Function to execute PATCH method
   * @param {String} route The route for API call
   * @param {Object} body The body of the API call, default {}
   * @param {Number} expectedCode The expected return code of API call, default 200
   * @param {RegExp} contentType The expected type of content returned by the API call. If null, not checked, default null
   * @param {String} token The token applied to the API call. If not defined, this.token will be applied, default null
   * @param {Function} toExecute Function to execute after API call ended. Takes all the response as parameter, default null
   * @returns {JSON} The body of the response of the API call
   */
  async patch (route, body = {}, expectedCode = 200, contentType = null, token = null, toExecute = null) {
    let res

    if (contentType) {
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
    } else {
      await request(this.app)
        .patch(route)
        .set({
          'x-auth-token': token || this.token
        })
        .send(body)
        .expect(expectedCode)
        .then((response) => {
          res = response.body
          if (toExecute) toExecute(response)
        })
    }
    return res
  }

  /**
   * Function to execute DELETE method
   * @param {String} route The route for API call
   * @param {Object} body The body of the API call, default {}
   * @param {Number} expectedCode The expected return code of API call, default 200
   * @param {RegExp} contentType The expected type of content returned by the API call. If null, not checked, default null
   * @param {String} token The token applied to the API call. If not defined, this.token will be applied, default null
   * @param {Function} toExecute Function to execute after API call ended. Takes all the response as parameter, default null
   * @returns {JSON} The body of the response of the API call
   */
  async delete (route, body = {}, expectedCode = 200, contentType = null, token = null, toExecute = null) {
    let res

    if (contentType) {
      await request(this.app)
        .delete(route)
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
    } else {
      await request(this.app)
        .delete(route)
        .set({
          'x-auth-token': token || this.token
        })
        .send(body)
        .expect(expectedCode)
        .then((response) => {
          res = response.body
          if (toExecute) toExecute(response)
        })
    }
    return res
  }

  /**
   * Function to get an Answer
   * @param filter Filter to be applied to the query
   * @returns {Promise<Query<any, any, unknown, any, "findOne">>}
   */
  async getAnswer (filter) {
    return Answers.findOne(filter)
  }

  /**
   * Function to get a Chat
   * @param filter Filter to be applied to the query
   * @returns {Promise<Query<any, any, unknown, any, "findOne">>}
   */
  async getChat (filter) {
    return Chats.findOne(filter)
  }

  /**
   * Function to get a Class
   * @param filter Filter to be applied to the query
   * @returns {Promise<Query<any, any, unknown, any, "findOne">>}
   */
  async getClass (filter) {
    return Classes.findOne(filter)
  }

  /**
   * Function to get a Facility
   * @param filter Filter to be applied to the query
   * @returns {Promise<Query<any, any, unknown, any, "findOne">>}
   */
  async getFacility (filter) {
    return Facilities.findOne(filter)
  }

  /**
   * Function to get a File
   * @param filter Filter to be applied to the query
   * @returns {Promise<Query<any, any, unknown, any, "findOne">>}
   */
  async getFile (filter) {
    return Files.findOne(filter)
  }

  /**
   * Function to get a HelpNumber
   * @param filter Filter to be applied to the query
   * @returns {Promise<Query<any, any, unknown, any, "findOne">>}
   */
  async getHelpNumber (filter) {
    return HelpNumbers.findOne(filter)
  }

  /**
   * Function to get a HelpNumberCategory
   * @param filter Filter to be applied to the query
   * @returns {Promise<Query<any, any, unknown, any, "findOne">>}
   */
  async getHelpNumberCategory (filter) {
    return HelpNumbersCategories.findOne(filter)
  }

  /**
   * Function to get a Message
   * @param filter Filter to be applied to the query
   * @returns {Promise<Query<any, any, unknown, any, "findOne">>}
   */
  async getMessage (filter) {
    return Messages.findOne(filter)
  }

  /**
   * Function to get a Questionnaire
   * @param filter Filter to be applied to the query
   * @returns {Promise<Query<any, any, unknown, any, "findOne">>}
   */
  async getQuestionnaire (filter) {
    return Questionnaires.findOne(filter)
  }

  /**
   * Function to get a Role
   * @param filter Filter to be applied to the query
   * @returns {Promise<Query<any, any, unknown, any, "findOne">>}
   */
  async getRole (filter) {
    return Roles.findOne(filter)
  }

  /**
   * Function to get a User
   * @param filter Filter to be applied to the query
   * @returns {Promise<Query<any, any, unknown, any, "findOne">>}
   */
  async getUser (filter) {
    return Users.findOne(filter)
  }

  async getMood (filter) {
    return Moods.findOne(filter)
  }
}
