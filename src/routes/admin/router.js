/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const facilityRouter = require('./facility/router')
/**
 * Main router connection
 * @memberof module:router~mainRouter
 * @inner
 * @namespace adminRouter
 */
router.use('/facility', facilityRouter)

module.exports = router
