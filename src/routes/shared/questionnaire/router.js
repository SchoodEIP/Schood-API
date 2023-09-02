/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const getQuestionnaires = require('./getQuestionnaires')

/**
 * Main router connection
 * @memberof module:router~mainRouter~sharedRouter
 * @inner
 * @namespace questionaireRouter
 */

router.get('/', getQuestionnaires)

module.exports = router
