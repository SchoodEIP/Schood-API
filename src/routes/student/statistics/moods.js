/**
 * @memberof module:router~mainRouter~sharedRouter~statisticsRouter
 * @inner
 * @namespace getQuestionnaires
 */

const Logger = require('../../../services/logger')
const { Questionnaires } = require('../../../models/questionnaire')
const { Answers } = require('../../../models/answers')
const { DailyMoods } = require('../../../models/dailyMoods')

/**
 * Main profile function
 * @name GET /shared/rolesList
 * @function
 * @memberof module:router~mainRouter~sharedRouter~rolesRouter~rolesList
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
    const moods = await DailyMoods.find({ ...agg, user: req.user._id })
    let average = 0

    for (const mood of moods) {
      const date = (new Date(mood.date)).toISOString().split('T')[0]
      response[date] = mood.mood
      average += mood.mood
    }
    response.averagePercentage = average / moods.length * 20

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
