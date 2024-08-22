/**
 * @module router
 * @requires express
 */

const express = require('express')
const router = express.Router()

const classesRouter = require('./classes/router')
const helpNumbersRouter = require('./helpNumber/router')
const helpNumberCategoriesRouter = require('./helpNumbersCategory/router')

const individualReport = require('./studentAnalysisIndividualReport')

const register = require('./users/register')
const csvRegisterUser = require('./users/csvRegisterUser')
const deleteUser = require('./users/delete')

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
router.use('/helpNumbersCategory', helpNumberCategoriesRouter)

router.get('/studentAnalysisReport/:id', individualReport)

router.post('/register/', upload10Tmp.single('file'), register)
router.post('/csvRegisterUser', upload10Tmp.single('csv'), csvRegisterUser)
router.delete('/deleteUser/:id', deleteUser)

module.exports = router
