/**
 * @module models
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

// We create the Schema for file, and we set up the required variables

/**
 * Answers schema, containing binaryData, name, mimetype
 * @constructor File
 */
const fileSchema = new Schema({
  binaryData: {
    type: Buffer,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  }
})

// We create answers collection from answersSchema
const Files = mongoose.model('files', fileSchema)

// We check if all required variables are here

module.exports = { Files }
