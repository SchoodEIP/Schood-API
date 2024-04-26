/**
 * @memberof module:router~mainRouter~sharedRouter~statisticsRouter
 * @inner
 * @namespace getMoods
 */

const Logger = require('../../../services/logger')
const { Moods } = require('../../../models/moods')

/**
 * Main mood function
 * @name POST /students/statistics/moods
 * @function
 * @memberof module:router~mainRouter~studentRouter~statisticsRouter~getMoods
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK and return the number of answers
 * @returns 422 if an errors occurs on fetching roles
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const { fromDate, toDate } = req.body

    if (!fromDate || !toDate) return res.status(400).json({ message: 'Date range missing' })

    const agg = buildAggregation(fromDate, toDate)
    const response = {}
    const moods = await Moods.find({ ...agg, user: req.user._id })
    let average = 0
    let numberMoods = 0

    for (const mood of moods) {
      const date = (new Date(mood.date)).toISOString().split('T')[0]
      if (!response[date]) response[date] = { moods: [], average: 0 }
      response[date].moods.push(mood.mood)
      response[date].average += mood.mood
      average += mood.mood
      numberMoods += 1
    }
    for (const date of Object.keys(response)) {
      response[date].average /= response[date].moods.length
    }
    response.averagePercentage = numberMoods > 0 ? average / numberMoods * 20 : 'NaN'

    return res.status(200).json(response)
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

const buildAggregation = (fromDate, toDate) => {
  const agg = { date: {} }

  const convertedFromDate = new Date(fromDate)
  if (fromDate && convertedFromDate !== null) {
    agg.date.$gte = convertedFromDate
  }

  const convertedToDate = new Date(toDate)
  if (toDate && convertedToDate !== null) {
    agg.date.$lte = convertedToDate
  }
  return agg
}
