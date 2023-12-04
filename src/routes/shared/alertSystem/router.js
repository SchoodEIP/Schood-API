/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const registerAlert = require('./registerAlert')
const access = require('../../../middleware/access')
const { upload10Tmp } = require('../../../utils/multer')
const registerAlertFile = require('./registerAlertFile')
const modifyAlert = require('./modifyAlert')
const deleteAlert = require('./deleteAlert')
const getAlerts = require('./getAlerts')

/**
 * Main router connection
 * @memberof module:router~mainRouter~sharedRouter
 * @inner
 * @namespace alertSystemRouter
 */

router.get('/', access(0, false), getAlerts)
router.post('/file/:id', access(1, false), upload10Tmp.single('file'), registerAlertFile)
router.post('/', access(1, false), registerAlert)
router.patch('/:id', access(1, false), modifyAlert)
router.delete('/:id', access(1, false), deleteAlert)

module.exports = router
