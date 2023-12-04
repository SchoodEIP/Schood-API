const express = require('express')

const app = express()
const router = require('../../routes/router')
const { dbConnection } = require('../../config/db')
const sanitizer = require('../../middleware/sanitize')
const Logger = require('../../services/logger')
require('dotenv').config({ path: '../.env' })

async function testServer () {
  Logger.displayed = false
  await dbConnection('test')
  Logger.displayed = true

  app.use(express.json())

  app.use('/', sanitizer, router)

  return app
}

exports.testServer = testServer
