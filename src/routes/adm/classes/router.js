/**
 * @module router
 * @requires express
 */

const express = require('express')
const router = express.Router()

const classRegister = require('./register')
const getAllClasses = require('./getAllClasses')
const classUpdate = require('./update')

/**
 * Adm router connection
 * @memberof module:router~mainRouter~admRouter
 * @inner
 * @namespace classesRouter
 */

// Created router routes connection

router.post('/register', classRegister)
router.patch('/:id', classUpdate)
router.get('/', getAllClasses)

module.exports = router
