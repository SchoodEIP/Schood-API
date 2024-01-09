/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace modifyProfile
 */
const { Users } = require('../../models/users')
const Logger = require('../../services/logger')

/**
 * Main modifyProfile function
 * @name PATCH /user/modifyProfile
 * @function
 * @memberof module:router~mainRouter~userRouter~modifyProfile
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 400 if invalid requests
 * @returns 200 if OK
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const userId = req.params.id

    if ((req.body.firstname || req.body.lastname) && req.user.role.levelOfAccess < 2) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    const user = await Users.findById(userId)

    user.firstname = req.body.firstname ? req.body.firstname : user.firstname
    user.lastname = req.body.lastname ? req.body.lastname : user.lastname
    user.email = req.body.email ? req.body.email : user.email

    await user.save();

    return res.status(200).send();
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
