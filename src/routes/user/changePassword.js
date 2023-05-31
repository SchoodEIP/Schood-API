/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace login
 */
const { Users, validateUser } = require('../../models/users')
const bcrypt = require('bcryptjs')

/**
 * Main changePassword function
 * @name POST /user/changePassword
 * @function
 * @memberof module:router~mainRouter~userRouter~changePassword
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 400 if invalid requests
 * @returns 400 if invalid oldPassword or newPassword
 * @returns 200 if OK and return access token and role name
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    console.log(req.user)
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
