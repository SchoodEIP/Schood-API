/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const access = require('../../middleware/access')


const questionnaire = require('./questionnaire')

/**
 * Main router connection
 * @memberof module:router~mainRouter
 * @inner
 * @namespace teacherRouter
 */

router.post('/questionnaire', access(1, true), questionnaire)

module.exports = router
