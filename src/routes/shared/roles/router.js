/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const rolesList = require('./rolesList')

/**
 * Main router connection
 * @memberof module:router~mainRouter~sharedRouter
 * @inner
 * @namespace rolesRouter
 */

router.get('/', rolesList)

module.exports = router
