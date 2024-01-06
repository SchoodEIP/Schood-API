/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const getNotifications = require('./getNotifications')

/**
 * Main router connection
 * @memberof module:router~mainRouter~sharedRouter
 * @inner
 * @namespace notificationsRouter
 */

router.get('/', getNotifications)

module.exports = router
