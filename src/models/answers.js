/**
 * @module models
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

// We create the Schema for answers and we setup the required variables

/**
 * Answers schema, containing email, password, firstname, lastname, role and classes
 * @constructor Answers
 */
const answersSchema = new Schema({
  questionnaire: {
    type: mongoose.Types.ObjectId,
    ref: 'questionnaires',
    required: true
  },
  date: {
    type: Date,
    default: new Date(),
    required: true
  },
  answers: [{
    question: {
      type: mongoose.Types.ObjectId,
      required: true
    },
    answer: {
      type: String,
      required: true
    }
  }],
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    required: true
  }
})

// We create answers collection from answersSchema
const Answers = mongoose.model('answers', answersSchema)

// We check if all required variables are here

const validateAnswers = (user) => {
  const schema = Joi.object({
    questionnaire: Joi.objectId().required(),
    date: Joi.date().required(),
    answers: Joi.array().items({
      question: Joi.objectId().required(),
      answer: Joi.string().required()
    }).required(),
    createdBy: Joi.objectId().required()
  })
  return schema.validate(user)
}

module.exports = { Answers, validateAnswers }
