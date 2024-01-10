/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const questionnaire = require('./questionnaire/router')
const dailyMood = require('./dailyMood/router')

/**
 * Main router connection
 * @memberof module:router~mainRouter
 * @inner
 * @namespace teacherRouter
 */

router.use('/questionnaire', questionnaire)
router.use('/dailyMood', dailyMood)

module.exports = router
