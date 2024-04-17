/**
 * @memberof module:router~mainRouter~studentRouter~moodRouter
 * @inner
 * @namespace register
 */

const { Moods, validateRegister } = require('../../../models/moods')

/**
 * Main mood register function
 * @name POST /student/mood
 * @function
 * @memberof module:router~mainRouter~studentRouter~moodRouter~register
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
    // Verif received data
    const { error } = validateRegister(req.body)
    if (error) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    const date = new Date()

    const mood = new Moods({
      user: req.user._id,
      mood: req.body.mood,
      date,
      comment: req.body.comment,
      annonymous: req.body.annonymous,
      facility: req.user.facility
    })

    mood.save()

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
