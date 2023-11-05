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

/**
 * Main router connection
 * @memberof module:router~mainRouter~sharedRouter
 * @inner
 * @namespace alertSystemRouter
 */

router.post('/file/:id', access(1, false), upload10Tmp.single('file'), registerAlertFile)
router.post('/', access(1, false), registerAlert)

module.exports = router
