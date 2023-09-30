/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const access = require('../../../middleware/access')

const questionnaire = require('./register')

/**
 * Main router connection
 * @memberof module:router~mainRouter~teacherRouter
 * @inner
 * @namespace questionaireRouter
 */

router.post('/', access(1, true), questionnaire)

module.exports = router
