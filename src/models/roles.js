/**
 * @module models
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')

// We create the Schema for roles, and we set up the required variables

/**
 * Roles schema, containing name and levelOfAccess
 * @constructor Roles
 */
const rolesSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  levelOfAccess: {
    type: Number,
    required: true
  }
})

// We create roles collection from rolesSchema
const Roles = mongoose.model('roles', rolesSchema)

// We check if all required variables are here

const validateRole = (role) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    levelOfAccess: Joi.number().required()
  })
  return schema.validate(
    role
  )
}

module.exports = { Roles, validateRole }