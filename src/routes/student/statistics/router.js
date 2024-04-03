/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const moods = require('./moods')
const answers = require('./questionnairesAnswers')

/**
 * Main router connection
 * @memberof module:router~mainRouter~studentRouter
 * @inner
 * @namespace statisticsRouter
 */

router.get('/moods', moods)
router.get('/answers', answers)

module.exports = router
