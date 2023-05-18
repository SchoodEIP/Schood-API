const express = require('express')

const app = express()
const router = require('../../routes/router')
const { dbConnection } = require('../../config/db')
const sanitizer = require('../../middleware/sanitize')
require('dotenv').config({ path: '../.env' })

async function testServer () {
  await dbConnection('test')

  app.use(express.json())

  app.use('/', sanitizer, router)

  return app
}

exports.testServer = testServer
