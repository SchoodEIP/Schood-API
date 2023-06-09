/**
 * @module middlewares
 */
const jwt = require('jsonwebtoken')
const { Users } = require('../models/users')

/**
 * Main auth middleware function
 * @name Auth Middleware
 * @function
 * @memberof module:middlewares
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns 403 if there is no token sent
 * @returns 400 if the token is invalid
 */
module.exports = async (req, res, next) => {
  try {
    // Get the auth token from the header
    const token = req.header('x-auth-token') || req.header('X-Auth-Token')
    if (!token) {
      return res.status(403).json({ message: 'Access Denied' })
    }

    // Verify the auth token with jwt
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await Users.findById(decoded._id)
    if (!user) {
      return res.status(400).json({ message: 'Invalid token' })
    }
    req.user = decoded

    next()
  } catch (error) {
    console.error(error)
    return res.status(400).json({ message: 'Invalid token' })
  }
}
