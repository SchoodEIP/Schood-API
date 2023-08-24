const express = require('express')
const router = express.Router()

const { upload10Tmp } = require('../../utils/multer')

const auth = require('../../middleware/auth')
const access = require('../../middleware/access')

const login = require('./login')
const changePassword = require('./changePassword')
const forgottenPassword = require('./forgottenPassword')
const profile = require('./profile')
const getUsersByPosition = require('./getUsersByPosition')
const getAllUsers = require('./getAllUsers')

const createChat = require('./chat/createChat')
const getChats = require('./chat/getChats')
const newMessage = require('./chat/newMessage')
const newFile = require('./chat/newFile')

const downloadFile = require('./downloadFile')

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

router.get('/chat', auth, getChats)
router.post('/chat', auth, createChat)
router.post('/chat/:id/newMessage', auth, newMessage)
router.post('/chat/:id/newFile', auth, upload10Tmp.single('file'), newFile)

router.get('/file/:id', auth, downloadFile)

module.exports = router
