const express = require('express')
const router = express.Router()

const auth = require('../../middleware/auth')
const access = require('../../middleware/access')

const login = require('./login')
const changePassword = require('./changePassword')
const forgottenPassword = require('./forgottenPassword')
const profile = require('./profile')
const getUsersByPosition = require('./getUsersByPosition')
const getAllUsers = require('./getAllUsers')
const updateUser = require('./updateUser')
const getAvailableChatUsers = require('./chat/getAvailableChatUsers')
const getAllHelpNumbers = require('./getAllHelpNumbers')

/**
 * User router connection
 * @memberof module:router~mainRouter
 * @inner
 * @namespace userRouter
 */

// Created router routes connection
router.post('/login', login)
router.post('/forgottenPassword', forgottenPassword)
router.patch('/changePassword', auth, changePassword)
router.get('/profile', auth, profile)
router.get('/by/:position', auth, access(2), getUsersByPosition)
router.get('/all', auth, access(2), getAllUsers)
router.patch('/:id', auth, access(1), updateUser)

// Created router routes, helpNumbers related
router.get('/helpNumbers', auth, getAllHelpNumbers)

// Created router routes, chat related
router.get('/chat/users', auth, getAvailableChatUsers)

module.exports = router
