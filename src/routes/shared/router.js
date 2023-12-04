/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const questionaireRouter = require('./questionnaire/router')
const reportRouter = require('./reports/router')
const alertSystemRouter = require('./alertSystem/router')

/**
 * Main router connection
 * @memberof module:router~mainRouter
 * @inner
 * @namespace sharedRouter
 */

router.use('/questionnaire', questionaireRouter)
router.use('/alert', alertSystemRouter)
router.use('/report', reportRouter)

module.exports = router
