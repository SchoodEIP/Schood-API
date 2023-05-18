/**
 * @module models
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')

const Level = {
    "PRIMAIRE": 0,
    "COLLEGE": 1,
    "LYCEE": 2,
    "SUPERIEUR": 3,
    "AUTRE": 4
}

// We create the Schema for facilities, and we set up the required variables.

/**
 * Facilities schema, containing name, address, telephone, level
 * @constructor Facilities
 */
const facilitiesSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    telephone: {
        type: String,
        required: true,
    },
    level: {
        type: Number,
        enum: Level,
        required: true,
    },
})

// We create facilities collection from facilitiesSchema
const Facilities = mongoose.model('facilities', facilitiesSchema)

// We check if all required variables are here

const validateFacilities = (facilities) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        address: Joi.string().required(),
        telephone: Joi.string().min(10).max(10).regex(RegExp("^[0-9]+$")).required(),
        level: Joi.number().integer().min(0).max(4).required(),
    })
    return schema.validate(
        facilities
    )
}

module.exports = { Facilities, validateFacilities }