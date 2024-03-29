/**
 * @module models
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

// We create the Schema for chat, and we set up the required variables

/**
 * Answers schema, containing facility, participants, date, createdBy
 * @constructor Chat
 */
const chatsSchema = new Schema({
  facility: {
    type: mongoose.Types.ObjectId,
    ref: 'facilities',
    required: true
  },
  participants: [{
    type: mongoose.Types.ObjectId,
    ref: 'users',
    required: true
  }],
  date: {
    type: Date,
    default: new Date(),
    required: true
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    required: true
  },
  messages: [{
    type: mongoose.Types.ObjectId,
    ref: 'messages'
  }],
  title: {
    type: String,
    required: true
  }
})

// We create answers collection from answersSchema
const Chats = mongoose.model('chats', chatsSchema)

// We check if all required variables are here

const validateChats = (chat) => {
  const schema = Joi.object({
    participants: Joi.array().items(Joi.objectId().required()).min(1).required(),
    title: Joi.string()
  })
  return schema.validate(chat)
}

module.exports = { Chats, validateChats }
