/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace getMoodById
 */

const { Moods, sanitizeMood } = require('../../models/moods')

/**
 * Main getMoodById function
 * @name GET /user/mood/:id
 * @function
 * @memberof module:router~mainRouter~userRouter~getMoodById
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
    const moods = await Moods.find({ user: req.query.id, annonymous: false }).sort({ date: -1 })

    return res.status(200).json(moods.map((mood) => sanitizeMood(mood)))
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
