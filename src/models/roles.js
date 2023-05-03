/**
 * @module models
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')

// We create the Schema for roles and we setup the required variables

/**
 * Roles schema, containing username and password
 * @constructor Roles
 */
const rolesSchema = new Schema({
  name: {
    type: String,
    required: true
  }
})

// We create roles collection from rolesSchema
const Users = mongoose.model('roles', rolesSchema)

// We check if all required variables are here

const validateRole = (role) => {
  const schema = Joi.object({
    name: Joi.string().required()
  })
  return schema.validate(
    role
  )
}

module.exports = { Users, validateRole }