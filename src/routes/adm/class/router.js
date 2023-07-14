const express = require('express')
const router = express.Router()
const register = require('./register')

/**
 * Adm router connection
 * @memberof module:router~mainRouter~admRouter
 * @inner
 * @namespace classRouter
 */

// Created router routes connection

router.post('/register/', register)

module.exports = router
