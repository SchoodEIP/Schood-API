/**
 * @memberof module:router~mainRouter~sharedRouter
 * @inner
 * @namespace notifications
 */

const { Notifications } = require('../../../models/notifications')

/**
 * Main notifications informations function
 * @name GET /shared/notifications/
 * @function
 * @memberof module:router~mainRouter~sharedRouter~notifications
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK and return access token and role name
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const notifications = await Notifications.find({ user: req.user._id, facility: req.user.facility })

    return res.status(200).json(notifications)
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
