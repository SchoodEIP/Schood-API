/**
 * @memberof module:router~mainRouter~admRouter
 * @inner
 * @namespace activate
 */

const { Users } = require('../../../models/users')
const mongoose = require('mongoose')
const Logger = require('../../../services/logger')

/**
 * Main activate function
 * @name POST /adm/activateUser/:id
 * @function
 * @memberof module:router~mainRouter~admRouter~activate
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 400 if invalid request
 * @returns 422 if user not found
 * @returns 200 if OK
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const id = req.params.id

    if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid request' })

    const userToActivate = await Users.findById(id)
    if (!userToActivate || userToActivate.length === 0) {
      return res.status(422).json({ message: 'User not found' })
    }

    userToActivate.active = true
    userToActivate.save()

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
