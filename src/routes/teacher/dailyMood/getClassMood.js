/**
 * @memberof module:router~mainRouter~dailyMoodRouter
 * @inner
 * @namespace dailyMood
 */

const { default: mongoose } = require('mongoose')
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
    const classId = req.params.id

    const date = new Date()
    date.setUTCHours(0, 0, 0, 0)

    const agg = [
      {
        $match: {
          date,
          facility: req.user.facility
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: {
          path: '$user'
        }
      },
      {
        $match: {
          'user.classes': new mongoose.Types.ObjectId(classId)
        }
      }
    ]
    const dailyMoods = await DailyMoods.aggregate(agg)

    let result = 0
    if (dailyMoods && dailyMoods.length > 0) {
      let sumDailyMoods = 0
      dailyMoods.forEach(dailyMood => {
        sumDailyMoods += dailyMood.mood
      })

      result = Math.round(sumDailyMoods / dailyMoods.length)
    }

    return res.status(200).json({ mood: result })
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
