/**
 * @memberof module:router~mainRouter~dailyMoodRouter
 * @inner
 * @namespace dailyMood
 */

const { Moods, validateRegister } = require('../../../models/moods')

/**
 * Main dailyMood function
 * @name POST /student/dailyMood
 * @function
 * @memberof module:router~mainRouter~dailyMoodRouter~dailyMood
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

    const moods = await Moods.find({ user: req.user._id }).sort({ date: -1 })
    if (!moods || moods.length === 0) return res.status(422).json({ message: 'No moods found' })

    const date = new Date()
    let mood = moods[0]
    for (let i = 1; i < moods.length; i += 1) {
      const selectedMoodDate = new Date(mood.date)
      const currentMoodDate = new Date(moods[i].date)

      if (date - currentMoodDate < date - selectedMoodDate) {
        mood = moods[i]
      }
    }

    mood.mood = req.body.mood
    mood.annonymous = req.body.annonymous
    mood.comment = typeof req.body.comment === 'string' ? req.body.comment : ''
    mood.seen = false

    mood.save()

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
