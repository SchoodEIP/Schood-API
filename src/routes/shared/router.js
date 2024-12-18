/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const questionaireRouter = require('./questionnaire/router')
const reportRouter = require('./reports/router')
const desanonymRouter = require('./desanonym/router')
const notificationsRouter = require('./notifications/router')
const alertSystemRouter = require('./alertSystem/router')
const classesRouter = require('./classes/router')
const rolesRouter = require('./roles/router')
const statisticsRouter = require('./statistics/router')
const titlesRouter = require('./titles/router')
const moodRouter = require('./moods/router')
const access = require('../../middleware/access')

/**
 * Main router connection
 * @memberof module:router~mainRouter
 * @inner
 * @namespace sharedRouter
 */

router.use('/questionnaire', questionaireRouter)
router.use('/alert', alertSystemRouter)
router.use('/report', reportRouter)
router.use('/desanonym', desanonymRouter)
router.use('/notifications', notificationsRouter)
router.use('/classes', access(1, false), classesRouter)
router.use('/roles', access(1, false), rolesRouter)
router.use('/statistics', access(1, false), statisticsRouter)
router.use('/titles', access(2, false), titlesRouter)
router.use('/moods', access(1, false), moodRouter)

module.exports = router
