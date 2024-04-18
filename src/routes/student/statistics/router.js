/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const dailyMoods = require('./dailyMoods')
const answers = require('./questionnairesAnswers')

/**
 * Main router connection
 * @memberof module:router~mainRouter~studentRouter
 * @inner
 * @namespace statisticsRouter
 */

router.post('/dailyMoods', dailyMoods)
router.post('/answers', answers)

module.exports = router
