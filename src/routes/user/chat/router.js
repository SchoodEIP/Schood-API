const express = require('express')
const router = express.Router()

const createChat = require('./createChat')
const getChats = require('./getChats')
const auth = require('../../../middleware/auth')
const getAvailableChatUsers = require('./getAvailableChatUsers')

/**
 * User router connection
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace chatRouter
 */

router.get('/', getChats)
router.post('/', createChat)

router.get('/users', auth, getAvailableChatUsers)

module.exports = router
