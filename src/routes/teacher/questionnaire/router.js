/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const questionnaire = require('./register')
const getAnswersFromStudent = require('./getAnswersFromStudent')
const getStudents = require('./getStudents')

/**
 * Main router connection
 * @memberof module:router~mainRouter~teacherRouter
 * @inner
 * @namespace questionaireRouter
 */

router.post('/', questionnaire)
router.get('/:id/students', getStudents)
router.get('/:id/answers/:studentId', getAnswersFromStudent)

module.exports = router
