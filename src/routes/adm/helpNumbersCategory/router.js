/**
 * @module router
 * @requires express
 */

const express = require('express')
const router = express.Router()

const helpNumberCategoryRegister = require('./register')
const helpNumberCategoryUpdate = require('./update')
const helpNumberCategoryDelete = require('./delete')

/**
 * Adm router connection
 * @memberof module:router~mainRouter~admRouter
 * @inner
 * @namespace helpNumberCategoriesRouter
 */

// Created router routes connection

router.post('/register', helpNumberCategoryRegister)
router.patch('/:id', helpNumberCategoryUpdate)
router.delete('/:id', helpNumberCategoryDelete)

module.exports = router
