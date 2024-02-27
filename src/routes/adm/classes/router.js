/**
 * @module router
 * @requires express
 */

const express = require('express')
const router = express.Router()

const classRegister = require('./register')
const classUpdate = require('./update')
const deleteClass = require('./delete')

/**
 * Adm router connection
 * @memberof module:router~mainRouter~admRouter
 * @inner
 * @namespace classesRouter
 */

// Created router routes connection

router.post('/register', classRegister)
router.patch('/:id', classUpdate)
router.delete('/:id', deleteClass)

module.exports = router
