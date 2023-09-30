/**
 * @module models
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

// We create the Schema for messages, and we set up the required variables

/**
 * Messages schema, containing user, date, content
 * @constructor Messages
 */
const messagesSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    required: true
  },
  date: {
    type: Date,
    default: new Date(),
    required: true
  },
  content: {
    type: String,
    required: true
  },
  chat: {
    type: mongoose.Types.ObjectId,
    ref: 'chats',
    required: true
  }
})

// We create answers collection from messagesSchema
const Messages = mongoose.model('messages', messagesSchema)

// We check if all required variables are here

const validateMessages = (message) => {
  const schema = Joi.object({
    content: Joi.string().min(1).required()
  })
  return schema.validate(message)
}

module.exports = { Messages, validateMessages }
