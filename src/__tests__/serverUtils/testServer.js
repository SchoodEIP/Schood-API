const express = require('express')

const app = express()
const router = require('../../routes/router')
const { dbConnection } = require('../../config/db')
const sanitizer = require('../../middleware/sanitize')
const Logger = require('../../services/logger')
const { default: mongoose } = require('mongoose')
require('dotenv').config({ path: '../.env' })

async function testServer () {
  if (mongoose.connection.readyState === 0) {
    Logger.displayed = false
    await dbConnection('test', true)
    Logger.displayed = process.env.LOGGER === 'true'
  }

  app.use(express.json())

  app.use('/', sanitizer, router)

  return app
}

exports.testServer = testServer
