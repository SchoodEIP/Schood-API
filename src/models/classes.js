/**
 * @module models
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')

// We create the Schema for classes and we setup the required variables

/**
 * Classes schema, containing name
 * @constructor Classes
 */
const classesSchema = new Schema({
  name: {
    type: String,
    required: true
  }
})

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

module.exports = { Classes, validateClasses }
