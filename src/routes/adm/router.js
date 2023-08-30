const express = require('express')
const router = express.Router()

const register = require('./register')
const csvRegisterUser = require('./csvRegisterUser')
const classRegister = require('./class/register')
const classUpdate = require('./class/update')
const helpNumbersCategoryRegister = require('./helpNumbersCategory/register')
const helpNumberRegister = require('./helpNumber/register')
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

router.patch('/class/:id', classUpdate)
router.post('/helpNumbersCategory/register', helpNumbersCategoryRegister)
router.post('/class/register', classRegister)
router.get('/rolesList', rolesList)
router.post('/helpNumber/register', helpNumberRegister)
router.post('/helpNumbersCategory/register', helpNumbersCategoryRegister)
router.post('/class/register', classRegister)
router.post('/register/', register)
router.post('/csvRegisterUser', upload.single('csv'), csvRegisterUser)

module.exports = router
