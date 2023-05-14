/**
 * @module models
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// We create the Schema for roles and we setup the required variables

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

module.exports = { Roles }
