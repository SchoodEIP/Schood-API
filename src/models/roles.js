/**
 * @module models
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// We create the Schema for roles, and we set up the required variables

/**
 * Roles schema, containing name and levelOfAccess
 * @constructor Roles
 */
const rolesSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  frenchName: {
    type: String,
    required: true,
    unique: true
  },
  levelOfAccess: {
    type: Number,
    required: true
  }
})

// We create roles collection from rolesSchema
const Roles = mongoose.model('roles', rolesSchema)

const isStudent = async (user) => {
  const userRole = await Roles.findById(user.role)

  return userRole.levelOfAccess === 0
}

const isStudentOrAbove = async (user) => {
  const userRole = await Roles.findById(user.role)

  return userRole.levelOfAccess >= 0
}

const isTeacher = async (user) => {
  const userRole = await Roles.findById(user.role)

  return userRole.levelOfAccess === 1
}

const isTeacherOrAbove = async (user) => {
  const userRole = await Roles.findById(user.role)

  return userRole.levelOfAccess >= 1
}

const isAdm = async (user) => {
  const userRole = await Roles.findById(user.role)

  return userRole.levelOfAccess === 2
}

const isAdmOrAbove = async (user) => {
  const userRole = await Roles.findById(user.role)

  return userRole.levelOfAccess >= 2
}

const isAdmin = async (user) => {
  const userRole = await Roles.findById(user.role)

  return userRole.levelOfAccess === 3
}

module.exports = {
  Roles,
  isStudent,
  isStudentOrAbove,
  isTeacher,
  isTeacherOrAbove,
  isAdm,
  isAdmOrAbove,
  isAdmin
}
