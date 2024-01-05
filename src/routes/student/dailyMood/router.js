/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const register = require('./register')
const get = require('./get')

/**
 * Main router connection
 * @memberof module:router~mainRouter~studentRouter
 * @inner
 * @namespace dailyMoodRouter
 */

router.post('/', register)
router.get('/', get)

module.exports = router
