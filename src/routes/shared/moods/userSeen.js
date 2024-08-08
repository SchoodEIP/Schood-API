/**
 * @memberof module:router~mainRouter~sharedRouter~moodsRouter
 * @inner
 * @namespace userSeen
 */

const { Moods } = require('../../../models/moods')
const mongoose = require('mongoose')
const { isUserPartOfMyClasses } = require('../../../models/users')
const { isTeacher } = require('../../../models/roles')

/**
 * Main userSeen function
 * @name POST /shared/moods/userSeen
 * @function
 * @memberof module:router~mainRouter~sharedRouter~moodsRouter~userSeen
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK and return access token and role name
 * @returns 400 if Invalid arguments
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const id = req.params.id

    // Verify id
    if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid request' })

    // Verify if mood exists
    const mood = await Moods.findById(id)
    if (!mood || mood.length === 0) return res.status(422).json({ message: 'No moods found' })

    // Verify if user is allowed
    if ((await isTeacher(req.user)) && !(await isUserPartOfMyClasses(req.user, mood.user))) return res.status(403).json({ message: 'Forbidden' })

    // Apply changes
    mood.seen = true
    mood.save()

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
