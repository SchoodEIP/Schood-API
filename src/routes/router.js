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
const teacherRouter = require('./teacher/router')
const studentRouter = require('./student/router')
const sharedRouter = require('./shared/router')

/**
 * Main router connection
 * @namespace mainRouter
 */
router.use('/user', userRouter)
router.use('/adm', auth, access(2, false), admRouter)
router.use('/admin', auth, access(3, false), adminRouter)
router.use('/teacher', auth, access(1, true), teacherRouter)
router.use('/student', auth, access(0, true), studentRouter)
router.use('/shared', auth, access(0, false), sharedRouter)

module.exports = router
