/**
 * @module models
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')

// We create the Schema for help numbers, and we set up the required variables.

/**
 * HelpNumbers schema, containing name, address, telephone, level
 * @constructor HelpNumbers
 */
const helpNumbersSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  telephone: {
    type: String
  },
  email: {
    type: String
  },
  helpNumbersCategory: {
    type: mongoose.Types.ObjectId,
    ref: 'helpNumbersCategories',
    required: true
  },
  description: {
    type: String
  },
  facility: {
    type: mongoose.Types.ObjectId,
    ref: 'facilities',
    required: true
  }
})

// We create facilities collection from facilitiesSchema
const HelpNumbers = mongoose.model('helpNumbers', helpNumbersSchema)

// We check if all required variables are here

const validateHelpNumbers = (helpNumber) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().optional(),
    telephone: Joi.string().min(10).max(10).regex(/^[0-9]+$/).optional(),
    helpNumbersCategory: Joi.required(),
    description: Joi.string().optional()
  })
  return schema.validate(
    helpNumber
  )
}

module.exports = { HelpNumbers, validateHelpNumbers }
