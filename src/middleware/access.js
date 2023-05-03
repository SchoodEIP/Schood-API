const { Roles } = require('../models/roles')
const { Users } = require('../models/users')

/**
 * Main permission middleware function
 * @name Permission Middleware
 * @function
 * @memberof module:middlewares
 * @inner
 * @async
 * @param {String} perm - The role name
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns 403 if the user is not found or the user have no access
 * @returns 500 Internal Server Error
 */
module.exports = (perm) => {
  return async (req, res, next) => {
    try {
      // Check if the user exist
      const user = await Users.findById(req.user._id)
      if (!user) {
        return res.status(403).json({ message: 'User not found' })
      }

      // Check if the user has a role
      const userRole = await Roles.findById(user.role)
      if (user.role === undefined) {
        return res.status(403).json({ message: 'Access Forbidden' })
      }

      // Check if the user has a good role
      if (userRole.levelOfAccess < perm) {
        return res.status(403).json({ message: 'Access Forbidden' })
      }
      next()
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}
