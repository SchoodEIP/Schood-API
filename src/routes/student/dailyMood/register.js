/**
 * @memberof module:router~mainRouter~dailyMoodRouter
 * @inner
 * @namespace dailyMood
 */

const { DailyMoods, validateRegister } = require('../../../models/dailyMoods')

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

    const date = new Date()
    date.setUTCHours(0,0,0,0)
    let dailyMood
    dailyMood = await DailyMoods.findOne({date: date})

    if (dailyMood) {
      dailyMood.mood = req.body.mood
    } else {
      dailyMood = new DailyMoods({
        user: req.user._id,
        mood: req.body.mood,
        date,
        facility: req.user.facility
      })
    }
    
    dailyMood.save();

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
