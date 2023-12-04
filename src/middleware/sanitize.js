/**
 * @module middlewares
 */
const sanitize = require('mongo-sanitize')
const Logger = require('../services/logger')

/**
 * Main sanitize middleware function
 * @name Sanitize Middleware
 * @function
 * @memberof module:middlewares
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */

module.exports = (req, res, next) => {
  try {
    req.body = sanitize(req.body)
    next()
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
