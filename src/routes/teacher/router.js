/**
 * @module router
 * @requires express
 */

const express = require('express')
const router = express.Router()
const updateUser = require('./updateUser')

/**
 * Adm router connection
 * @memberof module:router~mainRouter
 * @inner
 * @namespace teacherRouter
 */

// Created router routes connection

router.patch('/user/:id', updateUser)

module.exports = router
