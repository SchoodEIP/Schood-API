/**
 * @module router
 * @requires express
 */

const express = require('express')
const router = express.Router()

const classesRouter = require('./classes/router')
const helpNumbersRouter = require('./helpNumber/router')

const register = require('./register')
const csvRegisterUser = require('./csvRegisterUser')
const helpNumbersCategoryRegister = require('./helpNumbersCategory/register')
const helpNumbersCategoryUpdate = require('./helpNumbersCategory/update')
const rolesList = require('./rolesList')

const { upload10Tmp } = require('../../utils/multer')

/**
 * Adm router connection
 * @memberof module:router~mainRouter
 * @inner
 * @namespace admRouter
 */

// Created router routes connection

router.use('/classes', classesRouter)
router.use('/helpNumber', helpNumbersRouter)

router.get('/rolesList', rolesList)
router.post('/helpNumbersCategory/register', helpNumbersCategoryRegister)
router.patch('/helpNumbersCategory/:id', helpNumbersCategoryUpdate)
router.post('/register/', register)
router.post('/csvRegisterUser', upload10Tmp.single('csv'), csvRegisterUser)

module.exports = router
