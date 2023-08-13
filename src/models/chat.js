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
const chatSchema = new Schema({
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
  }
})

// We create answers collection from answersSchema
const Chats = mongoose.model('chats', chatSchema)

// We check if all required variables are here

const validateChats = (chat) => {
  const schema = Joi.object({
    participants: Joi.array().items(Joi.objectId().required()).min(1).required()
  })
  return schema.validate(chat)
}

module.exports = { Chats, validateChats }
