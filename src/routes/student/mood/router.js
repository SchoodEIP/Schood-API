/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const get = require('./get')
const update = require('./update')
const register = require('./register')

/**
 * Main router connection
 * @memberof module:router~mainRouter~studentRouter
 * @inner
 * @namespace moodRouter
 */

router.get('/', get)
router.post('/', register)
router.patch('/', update)

module.exports = router
