const express = require('express')
const router = express.Router()

const register = require('./register')

/**
 * Adm router connection
 * @memberof module:router~mainRouter
 * @inner
 * @namespace admRouter
 */

// Created router routes connection

router.post('/register', register)

module.exports = router