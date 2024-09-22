/**
 * @memberof module:router~mainRouter~sharedRouter~rolesRouter
 * @inner
 * @namespace rolesList
 */

const { Moods, sanitizeMood } = require('../../../models/moods')
const Logger = require('../../../services/logger')

/**
 * Main profile function
 * @name GET /shared/moods/moodsList
 * @function
 * @memberof module:router~mainRouter~sharedRouter~rolesRouter~rolesList
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK and return an array filled with all roles
 * @returns 422 if an errors occurs on fetching roles
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const moods = await Moods.find({ facility: req.user.facility }).populate('user').sort({ date: -1 })

    return res.status(200).json(moods.map((mood) => sanitizeMood(mood)))
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
