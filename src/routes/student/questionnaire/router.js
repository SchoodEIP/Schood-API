/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const registerAnswers = require('./registerAnswers')
const updateAnswers = require('./updateAnswers')
const getAnswers = require('./getAnswers')

/**
 * Main router connection
 * @memberof module:router~mainRouter~studentRouter
 * @inner
 * @namespace questionaireRouter
 */

router.post('/:id', registerAnswers)
router.patch('/:id', updateAnswers)
router.get('/:id', getAnswers)

module.exports = router
