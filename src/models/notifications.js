/**
 * @module models
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

// We create the Schema for notification, and we set up the required variables

/**
 * Notifications schema, containing user, date, content
 * @constructor Notifications
 */
const notificationsSchema = new Schema({
  concernedUser: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  viewed: {
    type: Boolean,
    default: false,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  topicId: {
    type: mongoose.Types.ObjectId
  },
  facility: {
    type: mongoose.Types.ObjectId,
    ref: 'facilities',
    required: true
  }
})

// We create notifications collection from notificationsSchema
const Notifications = mongoose.model('notifications', notificationsSchema)

module.exports = { Notifications }
