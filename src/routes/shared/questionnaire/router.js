/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const getQuestionnaires = require('./getQuestionnaires')
const getInformations = require('./getInformations')

/**
 * Main router connection
 * @memberof module:router~mainRouter~sharedRouter
 * @inner
 * @namespace questionaireRouter
 */

router.get('/', getQuestionnaires)
router.get('/:id', getInformations)

module.exports = router
