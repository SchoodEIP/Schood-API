/**
 * @module router
 * @requires express
 */
const express = require('express')
const router = express.Router()

const register = require('./register')
const modify = require('./modify')
const delete_ = require('./delete')

/**
 * Main router connection
 * @memberof module:router~mainRouter~adminRouter
 * @inner
 * @namespace titlesRouter
 */

router.post('/', register)
router.patch('/:id', modify)
router.delete('/:id', delete_)

module.exports = router
