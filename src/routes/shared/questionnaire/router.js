/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const getQuestionnaires = require('./getQuestionnaires')
const getInformations = require('./getInformations')
const getStatusLastTwo = require('./getStatusLastTwo')

/**
 * Main router connection
 * @memberof module:router~mainRouter~sharedRouter
 * @inner
 * @namespace questionaireRouter
 */

router.get('/', getQuestionnaires)
router.get('/statusLastTwo', getStatusLastTwo)
router.get('/:id', getInformations)

module.exports = router
