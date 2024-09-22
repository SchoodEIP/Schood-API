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
  timetable: {
    type: String
  },
  email: {
    type: String
  },
  informations: {
    type: String
  },
  address: {
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

helpNumbersSchema.index({ name: 1, facility: 1 }, { unique: true })

// We create facilities collection from facilitiesSchema
const HelpNumbers = mongoose.model('helpNumbers', helpNumbersSchema)

// We check if all required variables are here

const validateHelpNumbers = (helpNumber) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    telephone: Joi.string().max(10).regex(/^[0-9]+$/).optional(),
    timetable: Joi.string().optional(),
    email: Joi.string().optional(),
    informations: Joi.string().optional(),
    address: Joi.string().optional(),
    helpNumbersCategory: Joi.optional(),
    description: Joi.string().optional()
  })
  return schema.validate(
    helpNumber
  )
}

module.exports = { HelpNumbers, validateHelpNumbers }
