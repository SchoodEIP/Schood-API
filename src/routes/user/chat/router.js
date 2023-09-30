const express = require('express')
const router = express.Router()

const createChat = require('./createChat')
const getChats = require('./getChats')
const auth = require('../../../middleware/auth')
const getAvailableChatUsers = require('./getAvailableChatUsers')
const newMessage = require('./newMessage')
const newFile = require('./newFile')
const { upload10Tmp } = require('../../../utils/multer')
const getMessages = require('./getMessages')

/**
 * User router connection
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace chatRouter
 */

router.get('/', getChats)
router.get('/:id/messages', getMessages)
router.get('/users', auth, getAvailableChatUsers)

router.post('/', createChat)
router.post('/:id/newMessage', newMessage)
router.post('/:id/newFile', auth, upload10Tmp.single('file'), newFile)

router.get('/users', auth, getAvailableChatUsers)

module.exports = router
