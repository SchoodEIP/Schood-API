/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const access = require('../middleware/access')

const userRouter = require('./user/router')
const admRouter = require('./adm/router')
const facilityRouter = require('./facility/router')
/**
 * Main router connection
 * @namespace mainRouter
 */
router.use('/user', userRouter)
router.use('/adm', auth, access(2), admRouter)
router.use('/facility', auth, access(2), facilityRouter)

module.exports = router
