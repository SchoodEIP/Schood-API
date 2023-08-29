const express = require('express')
const router = express.Router()

const createChat = require('./createChat')
const getChats = require('./getChats')
const auth = require('../../../middleware/auth')
const newMessage = require('./newMessage')
const newFile = require('./newFile')
const getMessages = require('./getMessages')
const { upload10Tmp } = require('../../../utils/multer')

/**
 * User router connection
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace chatRouter
 */

router.get('/', getChats)
router.get('/:id/messages', getMessages)

router.post('/', createChat)
router.post('/:id/newMessage', auth, newMessage)
router.post('/:id/newFile', auth, upload10Tmp.single('file'), newFile)

module.exports = router
