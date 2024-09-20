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
const getClassUsers = require('./getClassUsers')

const updateUser = require('./updateUser')
const chatRouter = require('./chat/router')
const getAllHelpNumbers = require('./getAllHelpNumbers')
const getHelpNumbersByCategory = require('./getHelpNumbersByCategory')
const getAllHelpNumbersCategories = require('./getAllHelpNumbersCategories')

const downloadFile = require('./downloadFile')

const getFacility = require('./getFacility')
const modifyProfile = require('./modifyProfile')
const tokenCheck = require('./tokenCheck')
const downloadApk = require('./downloadApk')
const { upload10Tmp } = require('../../utils/multer')
const getMoodById = require('./getMoodById')

/**
 * User router connection
 * @memberof module:router~mainRouter
 * @inner
 * @namespace userRouter
 */

router.use('/chat', auth, chatRouter)

// Created router routes connection

// user
router.post('/login', login)
router.post('/forgottenPassword', forgottenPassword)
router.patch('/changePassword', auth, changePassword)
router.patch('/modifyProfile/:id', auth, upload10Tmp.single('file'), modifyProfile)
router.get('/profile', auth, profile)
router.get('/by/:position', auth, access(2, false), getUsersByPosition)
router.get('/all', auth, access(1, false), getAllUsers)
router.get('/tokenCheck', auth, tokenCheck)
router.get('/downloadApk', downloadApk)
router.patch('/:id', auth, access(1), updateUser)
router.get('/mood', auth, getMoodById)

// helpNumbers
router.get('/helpNumbers', auth, getAllHelpNumbers)
router.get('/helpNumbers/:id', auth, getHelpNumbersByCategory)
router.get('/helpNumbersCategories', auth, getAllHelpNumbersCategories)

// file
router.get('/file/:id', auth, downloadFile)
router.get('/class/:id', auth, access(1), getClassUsers)

// facility
router.get('/facility', auth, getFacility)

module.exports = router
