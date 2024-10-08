/**
 * @module models
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// We create the Schema for titles, and we set up the required variables

/**
 * Titles schema, containing name
 * @constructor Titles
 */
const titlesSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  facility: {
    type: mongoose.Types.ObjectId,
    ref: 'facilities',
    required: true
  }
})

titlesSchema.index({ name: 1, facility: 1 }, { unique: true })

// We create roles collection from titlesSchema
const Titles = mongoose.model('titles', titlesSchema)

module.exports = { Titles }
