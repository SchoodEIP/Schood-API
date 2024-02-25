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
    type: String
  },
  file: {
    type: mongoose.Types.ObjectId,
    ref: 'files'
  },
  chat: {
    type: mongoose.Types.ObjectId,
    ref: 'chats',
    required: true
  },
  facility: {
    type: mongoose.Types.ObjectId,
    ref: 'facilities',
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

const deleteMessageFromUserInChat = async (chat, user) => {
  for (const message of chat.messages) {
    await Messages.deleteOne({
      _id: message,
      user: user._id
    })
  }
}

module.exports = { Messages, validateMessages, deleteMessageFromUserInChat }
