/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const getClassMood = require('./getClassMood')

/**
 * Main router connection
 * @memberof module:router~mainRouter~teacherRouter
 * @inner
 * @namespace dailyMoodRouter
 */

router.get('/:id', getClassMood)

module.exports = router
