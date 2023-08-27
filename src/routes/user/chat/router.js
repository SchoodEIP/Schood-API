const express = require('express')
const router = express.Router()

const createChat = require('./createChat')
const getChats = require('./getChats')

/**
 * User router connection
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace chatRouter
 */

router.get('/', getChats)
router.post('/', createChat)

module.exports = router
