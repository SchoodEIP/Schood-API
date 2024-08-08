/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const { isUserPartOfMyClasses } = require("../models/users")

const auth = require('../middleware/auth')
const access = require('../middleware/access')

const userRouter = require('./user/router')
const admRouter = require('./adm/router')
const adminRouter = require('./admin/router')
const teacherRouter = require('./teacher/router')
const studentRouter = require('./student/router')
const sharedRouter = require('./shared/router')

const testAnalyze = require('../jobs/analyze/index')

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
router.get('/testAnalyze', async (req, res) => {
  await testAnalyze()
  return res.status(200).send()
})
router.get('/testtest', auth, async (req, res) => {
  if (await isUserPartOfMyClasses(req.user, '663204c48aa01b14ae9b8777'))
    return res.status(200).send('Yes')
  return res.status(400).send('Wtf')
})

module.exports = router
