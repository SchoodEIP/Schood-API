/**
 * @module router
 * @requires express
 */

const express = require('express')
const router = express.Router()

const helpNumberRegister = require('./register')
const helpNumberUpdate = require('./update')
const helpNumberDelete = require('./delete')

/**
 * Adm router connection
 * @memberof module:router~mainRouter~admRouter
 * @inner
 * @namespace helpNumbersRouter
 */

// Created router routes connection

router.post('/register', helpNumberRegister)
router.patch('/:id', helpNumberUpdate)
router.delete('/:id', helpNumberDelete)

module.exports = router
