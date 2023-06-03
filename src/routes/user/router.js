const express = require('express')
const router = express.Router()

const auth = require('../../middleware/auth')
const access = require('../../middleware/access')

const login = require('./login')
const forgottenPassword = require('./forgottenPassword')
const profile = require('./profile')

/**
 * User router connection
 * @memberof module:router~mainRouter
 * @inner
 * @namespace userRouter
 */

// Created router routes connection
router.post('/login', login)
router.post('/forgottenPassword', forgottenPassword)
router.get('/profile', auth, profile)

module.exports = router
