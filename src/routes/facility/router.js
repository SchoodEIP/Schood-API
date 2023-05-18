const express = require('express')
const router = express.Router()

const register = require('./register')

/**
 * Facility router connection
 * @memberof module:router~mainRouter
 * @inner
 * @namespace facilityRouter
 */

// Created router routes connection
router.post('/register', register)

module.exports = router
