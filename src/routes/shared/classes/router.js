/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const getAllClasses = require('./getAllClasses')

/**
 * Main router connection
 * @memberof module:router~mainRouter~sharedRouter
 * @inner
 * @namespace classesRouter
 */

router.get('/', getAllClasses)

module.exports = router
