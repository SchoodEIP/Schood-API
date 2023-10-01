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
const chatRouter = require('./chat/router')
const getAllHelpNumbers = require('./getAllHelpNumbers')
const getHelpNumbersByCategory = require('./getHelpNumbersByCategory')
const getAllHelpNumbersCategories = require('./getAllHelpNumbersCategories')

const downloadFile = require('./downloadFile')

/**
 * User router connection
 * @memberof module:router~mainRouter
 * @inner
 * @namespace userRouter
 */

router.use('/chat', auth, chatRouter)

// Created router routes connection
router.post('/login', login)
router.post('/forgottenPassword', forgottenPassword)
router.patch('/changePassword', auth, changePassword)
router.get('/profile', auth, profile)
router.get('/by/:position', auth, access(2, false), getUsersByPosition)
router.get('/all', auth, access(2, false), getAllUsers)
router.patch('/:id', auth, access(1), updateUser)
router.get('/helpNumbers', auth, getAllHelpNumbers)
router.get('/helpNumbers/:id', auth, getHelpNumbersByCategory)
router.get('/helpNumbersCategories', auth, getAllHelpNumbersCategories)
router.get('/file/:id', auth, downloadFile)

module.exports = router
