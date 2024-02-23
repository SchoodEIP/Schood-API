/**
 * @module models
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const jwt = require('jsonwebtoken')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

// We create the Schema for users and we setup the required variables

/**
 * Users schema, containing email, password, firstname, lastname, role and classes
 * @constructor Users
 */
const usersSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  role: {
    type: mongoose.Types.ObjectId,
    ref: 'roles',
    required: true
  },
  classes: [{
    type: mongoose.Types.ObjectId,
    ref: 'classes'
  }],
  facility: {
    type: mongoose.Types.ObjectId,
    ref: 'facilities',
    required: true
  },
  firstConnexion: {
    type: Boolean,
    required: true,
    default: true
  },
  active: {
    type: Boolean,
    default: true
  },
  picture: {
    type: string
  }
})

// We generate an auth token for user
usersSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' })
}

// We create users collection from usersSchema
const Users = mongoose.model('users', usersSchema)

// We check if all required variables are here

const validateUser = (user) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
  })
  return schema.validate(user)
}

const validateRegister = (user) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    role: Joi.objectId().required(),
    classes: Joi.array()
  })
  return schema.validate(user)
}

const validatePassword = (password) => {
  const schema = Joi.string()
    .min(7)
    .regex(/\d/)
    .regex(/[A-Z]+/)
    .regex(/[a-z]+/)
  return schema.validate(password)
}

const validateDelete = (body) => {
  const schema = Joi.object({
    deletePermanently: Joi.boolean().required()
  })
  return schema.validate(body)
}

const aggregateUsersInClass = (facilityId, classId) => {
  return [
    {
      $match: {
        facility: facilityId
      }
    },
    {
      $match:
        {
          classes:
            {
              $eq: new mongoose.Types.ObjectId(classId)
            }
        }
    }
  ]
}

module.exports = { Users, validateUser, validateRegister, validatePassword, validateDelete, aggregateUsersInClass }
