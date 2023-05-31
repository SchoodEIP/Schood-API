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
const adminRouter = require('./admin/router')
/**
 * Main router connection
 * @namespace mainRouter
 */
router.use('/user', userRouter)
router.use('/adm', admRouter)
router.use('/admin', auth, access(3), adminRouter)

module.exports = router
