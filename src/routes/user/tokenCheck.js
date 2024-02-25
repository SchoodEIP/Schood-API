/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace tokenCheck
 */
const Logger = require('../../services/logger')

/**
 * Main tokenCheck function
 * @name GET /user/tokenCheck
 * @function
 * @memberof module:router~mainRouter~userRouter~tokenCheck
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
