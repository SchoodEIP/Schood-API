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

const multer = require('multer')
const upload = multer({
  dest: '/tmp',
  limits: { fileSize: 1048576 } // 10 Mo
})

/**
 * Adm router connection
 * @memberof module:router~mainRouter
 * @inner
 * @namespace admRouter
 */

// Created router routes connection

router.use('/class/register', classRegister)
router.get('/rolesList', rolesList)
router.post('/register/', register)
router.post('/csvRegisterUser', upload.single('csv'), csvRegisterUser)

module.exports = router
