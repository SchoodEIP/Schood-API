/**
 * @module models
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')
const { Roles } = require('./roles')
const { Users } = require('./users')

// We create the Schema for classes and we setup the required variables

/**
 * Classes schema, containing name
 * @constructor Classes
 */
const classesSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  facility: {
    type: mongoose.Types.ObjectId,
    ref: 'facilities',
    required: true
  }
})

classesSchema.index({ name: 1, facility: 1 }, { unique: true })

// We create classes collection from classesSchema
const Classes = mongoose.model('classes', classesSchema)

// We check if all required variables are here

const validateClasses = (classes) => {
  const schema = Joi.object({
    name: Joi.string().required()
  })
  return schema.validate(
    classes
  )
}

const validateTeacher = (body) => {
  const schema = Joi.object({
    teacherId: Joi.objectId().required()
  })
  return schema.validate(body)
}

const validateStudent = (body) => {
  const schema = Joi.object({
    studentId: Joi.objectId().required()
  })
  return schema.validate(body)
}

const getTeacher = async (classId) => {
  const teacherRole = await Roles.findOne({ name: 'teacher' })
  if (!teacherRole || teacherRole.length === 0) return null

  return await Users.findOne({ classes: { $in: classId }, role: teacherRole })
}

const getStudent = async (classId) => {
  const studentRole = await Roles.findOne({ name: 'student' })
  if (!studentRole || studentRole.length === 0) return null

  return await Users.findOne({ classes: { $in: classId }, role: studentRole })
}

module.exports = {
  Classes,
  validateClasses,
  validateTeacher,
  getTeacher,
  validateStudent,
  getStudent
}
