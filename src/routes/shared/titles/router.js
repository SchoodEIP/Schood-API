/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const get = require('../../shared/titles/get')

/**
 * Main router connection
 * @memberof module:router~mainRouter~sharedRouter
 * @inner
 * @namespace titlesRouter
 */

router.get('/', get)

module.exports = router
