const Logger = require('../services/logger')

/**
 * Main permission middleware function
 * @name Permission Middleware
 * @function
 * @memberof module:middlewares
 * @inner
 * @async
 * @param {String} levelOfAccess - The levelOfAccess
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns 403 if the user is not found or the user have no access
 * @returns 500 Internal Server Error
 */
module.exports = (levelOfAccess, onlyMode) => {
  return async (req, res, next) => {
    try {
      // Check if the user has a role
      if (!req.user.role || req.user.role === undefined || req.user.role.length === 0) {
        return res.status(403).json({ message: 'Access Forbidden' })
      }

      // Check if the user has a good role
      if (onlyMode) {
        if (req.user.role.levelOfAccess !== levelOfAccess) {
          return res.status(403).json({ message: 'Access Forbidden' })
        }
      } else {
        if (req.user.role.levelOfAccess < levelOfAccess) {
          return res.status(403).json({ message: 'Access Forbidden' })
        }
      }
      next()
    } catch (error) /* istanbul ignore next */ {
      Logger.error(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}
