/**
 * @module models
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const Status = {
  ACCEPTED: 'accepted',
  REFUSED: 'refused',
  WAITING: 'waiting'
}

// We create the Schema for desanonyms and we setup the required variables

/**
 * Desanonyms schema, containing title, message, file, forClasses, classes, role, createdAt, createdBy and facility
 * @constructor Desanonyms
 */
const desanonymsSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'users'
  },
  mood: {
    type: mongoose.Types.ObjectId,
    ref: 'moods'
  },
  reason: {
    type: String,
    required: false
  },
  message: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: Status,
    default: Status[2]
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
},
{
  timestamps: true
})

// We create desanonyms collection from desanonymsSchema
const Desanonyms = mongoose.model('desanonyms', desanonymsSchema)

// We check if all required variables are here

const validateDesanonyms = (alert) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    mood: Joi.string().required(),
    reason: Joi.string().optional(),
    message: Joi.string().optional()
  })
  return schema.validate(alert)
}

const validateModify = (alert) => {
  const schema = Joi.object({
    reason: Joi.string().optional(),
    message: Joi.string().optional(),
    status: Joi.string().optional()
  })
  return schema.validate(alert)
}

module.exports = { Desanonyms, validateDesanonyms, validateModify }
