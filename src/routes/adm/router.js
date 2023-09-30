const express = require('express')
const router = express.Router()

const register = require('./register')
const csvRegisterUser = require('./csvRegisterUser')
const classesRouter = require('./classes/router')
const helpNumbersCategoryRegister = require('./helpNumbersCategory/register')
const helpNumberRegister = require('./helpNumber/register')
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
router.get('/rolesList', rolesList)
router.post('/helpNumber/register', helpNumberRegister)
router.post('/helpNumbersCategory/register', helpNumbersCategoryRegister)
router.post('/register/', register)
router.post('/csvRegisterUser', upload10Tmp.single('csv'), csvRegisterUser)

module.exports = router
