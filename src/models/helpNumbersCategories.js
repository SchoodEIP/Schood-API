/**
 * @module models
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')

// We create the Schema for help numbers, and we set up the required variables.

/**
 * HelpNumbersCategories schema, containing name
 * @constructor HelpNumbersCategories
 */
const helpNumbersCategoriesSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  facility: {
    type: mongoose.Types.ObjectId,
    ref: 'facilities',
    required: true
  },
  default: {
    type: Boolean,
    default: false
  }
})

helpNumbersCategoriesSchema.index({name: 1, facility: 1}, {unique: true});

// We create facilities collection from facilitiesSchema
const HelpNumbersCategories = mongoose.model('HelpNumbersCategories', helpNumbersCategoriesSchema)

// We check if all required variables are here

const validateHelpNumbersCategories = (helpNumber) => {
  const schema = Joi.object({
    name: Joi.string().min(1).required()
  })

  return schema.validate(helpNumber)
}

module.exports = { HelpNumbersCategories, validateHelpNumbersCategories }
