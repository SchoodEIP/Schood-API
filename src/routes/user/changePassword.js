/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace changePassword
 */
const { Users, validatePassword } = require('../../models/users')
const bcrypt = require('bcryptjs')

/**
 * Main changePassword function
 * @name PATCH /user/changePassword
 * @function
 * @memberof module:router~mainRouter~userRouter~changePassword
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 400 if invalid requests
 * @returns 400 if invalid oldPassword or newPassword
 * @returns 422 if invalid oldPassword and newPassword are equal
 * @returns 200 if OK
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    if (!req.body.oldPassword || !req.body.newPassword) {
      return res.status(400).json({ message: 'Invalid body' })
    }

    if (req.body.oldPassword === req.body.newPassword) {
      return res.status(422).json({ message: 'The new password has to be different from the old one.' })
    }

    const { error } = validatePassword(req.body.newPassword)
    if (error) {
      return res.status(400).json({ message: 'Invalid new password' })
    }

    const valid = await bcrypt.compare(req.body.oldPassword, req.user.password)
    if (!valid) {
      return res.status(400).json({ message: 'Invalid old password' })
    }

    if (req.user.firstConnexion) {
      req.user.firstConnexion = false
    }

    req.user.password = await bcrypt.hash(req.body.newPassword, 10)
    await req.user.save()

    return res.status(200).json({ message: 'ok' })
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
