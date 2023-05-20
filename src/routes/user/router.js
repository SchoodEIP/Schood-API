const express = require('express')
const router = express.Router()

const login = require('./login')
const forgottenPassword = require('./forgottenPassword')

/**
 * User router connection
 * @memberof module:router~mainRouter
 * @inner
 * @namespace userRouter
 */

// Created router routes connection
router.post('/login', login)
router.post('/forgottenPassword', forgottenPassword)

module.exports = router
