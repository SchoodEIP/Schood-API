/**
 * @memberof module:router~mainRouter~dailyMoodRouter
 * @inner
 * @namespace dailyMood
 */

const { DailyMoods } = require('../../../models/dailyMoods')

/**
 * Main dailyMood function
 * @name GET /student/dailyMood
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

    const date = new Date()
    date.setUTCHours(0, 0, 0, 0)
    const dailyMood = await DailyMoods.findOne({ date })

    return res.status(200).json({mood: dailyMood && dailyMood.mood ? dailyMood.mood : 0})
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
