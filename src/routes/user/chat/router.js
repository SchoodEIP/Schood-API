const express = require('express')
const router = express.Router()

const createChat = require('./createChat')
const getChats = require('./getChats')
const auth = require('../../../middleware/auth')
const getAvailableChatUsers = require('./getAvailableChatUsers')
const newMessage = require('./newMessage')

/**
 * User router connection
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace chatRouter
 */

router.get('/', getChats)
router.post('/', createChat)
router.post('/:id/newMessage', newMessage)

router.get('/users', auth, getAvailableChatUsers)

module.exports = router
