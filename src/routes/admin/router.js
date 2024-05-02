/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const facilityRouter = require('./facility/router')
const titlesRouter = require('./titles/router')

/**
 * Main router connection
 * @memberof module:router~mainRouter
 * @inner
 * @namespace adminRouter
 */
router.use('/facility', facilityRouter)
router.use('/title', titlesRouter)

module.exports = router
