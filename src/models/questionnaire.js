/**
 * @module models
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const Types = {
  TEXT: 'text',
  EMOJI: 'emoji',
  MULTIPLE: 'multiple'
}

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
  fromDate: {
    type: Date,
    required: true
  },
  toDate: {
    type: Date,
    required: true
  },
  questions: [{
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: Types,
      default: Types[0],
      required: true
    },
    answers: [{
      position: {
        type: Number,
        required: true
      },
      title: {
        type: String,
        required: true
      }
    }]
  }],
  classes: [{
    type: mongoose.Types.ObjectId,
    ref: 'classes',
    required: true
  }],
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    required: true
  }
})

// We create questionnaire collection from questionnaireSchema
const Questionnaires = mongoose.model('questionnaires', questionnaireSchema)

// We check if all required variables are here

const validateQuestionnaire = (questionnaire) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    date: Joi.date().required(),
    questions: Joi.array().items({
      title: Joi.string().required(),
      type: Joi.string().valid(...Object.values(Types)).required(),
      answers: Joi.array().items({
        position: Joi.number(),
        title: Joi.string()
      })
    }).required()
  })
  return schema.validate(questionnaire)
}

module.exports = { Questionnaires, validateQuestionnaire, Types }
