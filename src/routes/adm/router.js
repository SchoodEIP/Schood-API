/**
 * @module router
 * @requires express
 */

const express = require('express')
const router = express.Router()

const register = require('./register')
const csvRegisterUser = require('./csvRegisterUser')
const classRegister = require('./class/register')
const rolesList = require('./rolesList')

const { upload10Tmp } = require('../../utils/multer')

/**
 * Adm router connection
 * @memberof module:router~mainRouter
 * @inner
 * @namespace admRouter
 */

// Created router routes connection

router.get('/rolesList', rolesList)
router.use('/class/register', classRegister)
router.post('/register/', register)
router.post('/csvRegisterUser', upload10Tmp.single('csv'), csvRegisterUser)

module.exports = router
