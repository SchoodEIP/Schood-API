/**
 * @module models
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')

// We create the Schema for dailyMoods and we setup the required variables

/**
 * DailyMoods schema, containing name
 * @constructor DailyMoods
 */
const dailyMoods = new Schema({
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
    default: new Date()
  },
  facility: {
    type: mongoose.Types.ObjectId,
    ref: 'facilities',
    required: true
  }
})

// We create classes collection from dailyMoods
const DailyMoods = mongoose.model('dailyMoods', dailyMoods)

// We check if all required variables are here

const validateDailyMoods = (dailyMoods) => {
  const schema = Joi.object({
    name: Joi.string().required()
  })
  return schema.validate(dailyMoods)
}

module.exports = { DailyMoods, validateDailyMoods }
