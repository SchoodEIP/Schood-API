/**
 * @module models
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { deleteMessageFromUserInChat } = require('./message')
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
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'users',
      required: true
    },
    canSeeAfter: {
      type: Date,
      default: new Date()
    }
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
    participants: Joi.array().required(),
    title: Joi.string()
  })
  return schema.validate(chat)
}

const removeUserFromChat = async (chat, user, res = null) => {
  const idx = chat.participants.findIndex(u => u.equals(user._id))
  if (idx === -1) return res ? res.status(422).json({ message: 'User not in chat' }) : null

  chat.participants.splice(idx, 1)

  if (chat.participants.length === 1) {
    await Chats.findByIdAndDelete(chat._id)
  } else {
    if (chat.createdBy.equals(user._id)) {
      chat.createdBy = chat.participants[0]
    }
    await deleteMessageFromUserInChat(chat, user)
    await Chats.findByIdAndUpdate(chat._id, chat)
  }

  return res ? res.status(200).send() : null
}

module.exports = { Chats, validateChats, removeUserFromChat }
