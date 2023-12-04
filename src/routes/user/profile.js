/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace profile
 */

const Logger = require('../../services/logger')

/**
 * Main profile function
 * @name GET /user/profile
 * @function
 * @memberof module:router~mainRouter~userRouter~profile
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK and return access token and role name
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const response = JSON.parse(JSON.stringify(req.user))
    delete response.password

    // Send profile
    return res.status(200).json(response)
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
