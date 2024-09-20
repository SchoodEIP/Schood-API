/**
 * @module models
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')

// We create the Schema for moods and we setup the required variables

/**
 * Moods schema, containing name
 * @constructor DailyMoods
 */
const moods = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    required: true
  },
  mood: {
    type: Number,
    min: 0,
    max: 5,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: function () /* istanbul ignore next */ {
      const date = new Date()
      date.setUTCHours(0, 0, 0, 0)
      return date
    }
  },
  comment: {
    type: String,
    default: ''
  },
  annonymous: {
    type: Boolean,
    required: true
  },
  facility: {
    type: mongoose.Types.ObjectId,
    ref: 'facilities',
    required: true
  },
  seen: {
    type: Boolean,
    default: false
  }
})

// We create classes collection from moods
const Moods = mongoose.model('moods', moods)

// We check if all required variables are here

const validateRegister = (mood) => {
  const schema = Joi.object({
    mood: Joi.number().min(0).max(5).required(),
    comment: Joi.string().max(1000),
    annonymous: Joi.boolean().required()
  })
  return schema.validate(mood)
}

const sanitizeMood = (mood) => {
  return {
    _id: mood._id,
    user: mood.user,
    mood: mood.mood,
    date: mood.date,
    comment: mood.comment,
    annonymous: mood.annonymous,
    facility: mood.facility
  }
}

module.exports = { Moods, validateRegister, sanitizeMood }
