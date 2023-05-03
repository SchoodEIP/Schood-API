/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const userRouter = require('./user/router')
/**
 * Main router connection
 * @namespace mainRouter
 */
router.use('/user', sanitizer, userRouter)

module.exports = router
