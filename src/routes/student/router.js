/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const questionaireRouter = require('./questionnaire/router')
const dailyMoodRouter = require('./dailyMood/router')

/**
 * Main router connection
 * @memberof module:router~mainRouter
 * @inner
 * @namespace studentRouter
 */

router.use('/questionnaire', questionaireRouter)
router.use('/dailyMood', dailyMoodRouter)

module.exports = router
