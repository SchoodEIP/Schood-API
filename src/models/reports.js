/**
 * @module models
 */

const Joi = require('joi')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Types = {
  OTHER: 'other',
  BULLYING: 'bullying',
  BADCOMPORTMENT: 'badcomportment',
  SPAM: 'spam'
}

// We create the Schema for Reports, and we set up the required variables

/**
 * Reports schema, containing userSignaled, signaledBy, createdAt, message and conversation
 * @constructor Reports
 */
const reportsSchema = new Schema({
  userSignaled: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    required: true
  },
  signaledBy: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date()
  },
  modifiedAt: {
    type: Date,
  },
  modifiedBy: {
    type: mongoose.Types.ObjectId,
    ref: 'users'
  },
  message: {
    type: String,
    default: ""
  },
  conversation: {
    type: mongoose.Types.ObjectId,
    ref: 'chats',
  },
  type: {
    type: String,
    enum: Types,
    default: Types[0],
    required: true
  },
  facility: {
    type: mongoose.Types.ObjectId,
    ref: 'facilities',
    required: true
  }
})

// We create reports collection from reportsSchema
const Reports = mongoose.model('reports', reportsSchema)

const validateRegister = (report) => {
  const schema = Joi.object({
    userSignaled: Joi.objectId().required(),
    message: Joi.string().allow(null, ''),
    conversation: Joi.objectId().allow(null, ''),
    type: Joi.string().valid(...Object.values(Types)).required()
  })
  return schema.validate(report)
}

const validateModify = (report) => {
  const schema = Joi.object({
    userSignaled: Joi.objectId().allow(null, ''),
    message: Joi.string().allow(null, ''),
    conversation: Joi.objectId().allow(null, ''),
    type: Joi.string().valid(...Object.values(Types)).required()
  })
  return schema.validate(report)
}

module.exports = { Reports, validateRegister, validateModify }
