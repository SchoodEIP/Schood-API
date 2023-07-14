/**
 * @module models
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

// We create the Schema for questionnaire and we setup the required variables

/**
 * Questionnaire schema, containing title, type, date, createdBy
 * @constructor Questionnaire
 */
const questionnaireSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: new Date(),
    required: true
  },
  questions: [{
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['text', 'emoji', 'multiple'],
      default: 'text',
      required: true
    },
    validate: v => Array.isArray(v) && v.length > 0
  }],
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    required: true
  }
})

// We create questionnaire collection from questionnaireSchema
const Questionnaire = mongoose.model('questionnaires', questionnaireSchema)

// We check if all required variables are here

const validateQuestionnaire = (questionnaire) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    date: Joi.date().required(),
    questions: Joi.array().required(),
    createdBy: Joi.objectId().required()
  })
  return schema.validate(questionnaire)
}

module.exports = { Questionnaire, validateQuestionnaire }
