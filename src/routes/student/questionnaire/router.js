/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const registerAnswers = require('./registerAnswers')

/**
 * Main router connection
 * @memberof module:router~mainRouter~studentRouter
 * @inner
 * @namespace questionaireRouter
 */

router.post('/:id', registerAnswers)

module.exports = router
