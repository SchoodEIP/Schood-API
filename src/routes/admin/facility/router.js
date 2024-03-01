const express = require('express')
const router = express.Router()

const register = require('./register')
const update = require('./update')
const deleteFacility = require('./delete')

/**
 * Facility router connection
 * @memberof module:router~mainRouter~adminRouter
 * @inner
 * @namespace facilityRouter
 */

// Created router routes connection
router.post('/', register)
router.patch('/:id', update)
router.delete('/:id', deleteFacility)

module.exports = router
