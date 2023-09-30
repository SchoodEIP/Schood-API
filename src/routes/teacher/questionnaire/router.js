/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const questionnaire = require('./register')
const getAnswersFromStudent = require('./getAnswersFromStudent')
const getStudents = require('./getStudents')
const patchQuestionnaire = require('./update')

/**
 * Main router connection
 * @memberof module:router~mainRouter~teacherRouter
 * @inner
 * @namespace questionaireRouter
 */

router.post('/', questionnaire)
router.get('/:id/students', getStudents)
router.get('/:id/answers/:studentId', getAnswersFromStudent)
router.patch('/:id', patchQuestionnaire)

module.exports = router
