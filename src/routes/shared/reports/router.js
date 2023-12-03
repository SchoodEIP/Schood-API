/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const register = require('./register')
const modify = require('./modify')
const delete_ = require('./delete')
const get = require('./get')
const access = require('../../../middleware/access')

/**
 * Main router connection
 * @memberof module:router~mainRouter~sharedRouter
 * @inner
 * @namespace reportsRouter
 */

router.post('/', register)
router.patch('/:id', modify)
router.delete('/:id', access(2, true), delete_)
router.get('/', get)

module.exports = router
