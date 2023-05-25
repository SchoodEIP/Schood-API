const express = require('express')
const router = express.Router()
const register = require('./register')
const csvRegisterUser = require('./csvRegisterUser')
const multer = require('multer');
const upload = multer({ dest:  "/tmp" })

/**
 * Adm router connection
 * @memberof module:router~mainRouter
 * @inner
 * @namespace admRouter
 */

// Created router routes connection

router.post('/register/:mail', register)
router.post('/csvRegisterUser', upload.single("csv"), csvRegisterUser)

module.exports = router
