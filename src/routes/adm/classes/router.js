/**
 * @module router
 * @requires express
 */

const express = require('express')
const router = express.Router()

const classRegister = require('./register')
const classUpdate = require('./update')
const classAddTeacher = require('./addTeacher')
const classRemoveTeacher = require('./removeTeacher')
const deleteClass = require('./delete')
const updateStudent = require('./updateStudent')

/**
 * Adm router connection
 * @memberof module:router~mainRouter~admRouter
 * @inner
 * @namespace classesRouter
 */

// Created router routes connection

router.post('/register', classRegister)
router.patch('/:id/updateStudent', updateStudent)
router.patch('/:id', classUpdate)
router.patch('/:id/addTeacher', classAddTeacher)
router.patch('/:id/removeTeacher', classRemoveTeacher)
router.delete('/:id', deleteClass)

module.exports = router
