/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const userSeen = require('./userSeen')
const moodsList = require('./moodsList')


/**
 * Main router connection
 * @memberof module:router~mainRouter~sharedRouter
 * @inner
 * @namespace moodsRouter
 */
router.post('/userSeen/:id', userSeen)
router.get('/all', moodsList)

module.exports = router
