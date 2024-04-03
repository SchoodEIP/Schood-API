/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const numberQuestionnaires = require('./numberQuestionnaires')
const numberAnswersQuestionnaires = require('./numberAnswersQuestionnaires')
const moods = require('./moods')

/**
 * Main router connection
 * @memberof module:router~mainRouter~sharedRouter
 * @inner
 * @namespace statisticsRouter
 */

router.get('/numberQuestionnaires', numberQuestionnaires)
router.get('/numberAnswersQuestionnaires', numberAnswersQuestionnaires)
router.get('/moods', moods)

module.exports = router
