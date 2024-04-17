/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const numberQuestionnaires = require('./numberQuestionnaires')
const numberAnswersQuestionnaires = require('./numberAnswersQuestionnaires')
const dailyMoods = require('./dailyMoods')
const answers = require('./questionnairesAnswers')

/**
 * Main router connection
 * @memberof module:router~mainRouter~sharedRouter
 * @inner
 * @namespace statisticsRouter
 */

router.post('/numberQuestionnaires', numberQuestionnaires)
router.post('/numberAnswersQuestionnaires', numberAnswersQuestionnaires)
router.post('/dailyMoods', dailyMoods)
router.post('/answers', answers)

module.exports = router
