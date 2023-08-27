/**
 * @module router
 * @requires express
 */

const express = require('express')
const router = express.Router()

const classRegister = require('./register')
const getAllClasses = require('./getAllClasses')

/**
 * Adm router connection
 * @memberof module:router~mainRouter~admRouter
 * @inner
 * @namespace classesRouter
 */

// Created router routes connection

router.post('/register', classRegister)
router.get('/', getAllClasses)

module.exports = router
