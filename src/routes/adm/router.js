/**
 * @module router
 * @requires express
 */

const express = require('express')
const router = express.Router()

const register = require('./register')
const csvRegisterUser = require('./csvRegisterUser')
const classRegister = require('./class/register')
<<<<<<< HEAD
const helpNumbersCategoryRegister = require('./helpNumbersCategory/register')
const helpNumberRegister = require('./helpNumber/register')
=======
>>>>>>> 9e365136ad552ce221d78a682b468a001775adab
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

router.get('/rolesList', rolesList)
router.post('/helpNumber/register', helpNumberRegister)
router.post('/helpNumbersCategory/register', helpNumbersCategoryRegister)
router.post('/class/register', classRegister)
router.post('/register/', register)
router.post('/csvRegisterUser', upload.single('csv'), csvRegisterUser)

module.exports = router
