/**
 * @module models
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

// We create the Schema for alertSystem and we setup the required variables

/**
 * AlertSystem schema, containing email, password, firstname, lastname, role and classes
 * @constructor AlertSystem
 */
const alertSystemSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  file: {
    type: mongoose.Types.ObjectId,
    ref: 'files'
  },
  forClasses: {
    type: Boolean,
    required: true
  },
  classes: [{
    type: mongoose.Types.ObjectId,
    ref: 'classes'
  }],
  role: {
    type: mongoose.Types.ObjectId,
    ref: 'roles'
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date()
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'users'
  },
  facility: {
    type: mongoose.Types.ObjectId,
    ref: 'facilities',
    required: true
  }
})

// We create alertSystem collection from alertSystemSchema
const AlertSystem = mongoose.model('alertSystem', alertSystemSchema)

// We check if all required variables are here

const validateAlert = (alert) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    message: Joi.string().required(),
    classes: Joi.array().optional(),
    role: Joi.string().optional()
  })
  return schema.validate(alert)
}

module.exports = { AlertSystem, validateAlert }
