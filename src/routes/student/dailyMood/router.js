/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const register = require('./register')

/**
 * Main router connection
 * @memberof module:router~mainRouter~studentRouter
 * @inner
 * @namespace dailyMoodRouter
 */

router.post('/', register)

module.exports = router
