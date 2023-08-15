/**
 * @module models
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

// We create the Schema for chat, and we set up the required variables

/**
 * Answers schema, containing user, date, content
 * @constructor Message
 */
const messageSchema = new Schema({
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
  }
})

// We create answers collection from answersSchema
const Messages = mongoose.model('messages', messageSchema)

// We check if all required variables are here

const validateMessages = (message) => {
  const schema = Joi.object({
    content: Joi.string().min(1).required()
  })
  return schema.validate(message)
}

module.exports = { Messages, validateMessages }
