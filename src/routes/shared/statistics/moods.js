/**
 * @memberof module:router~mainRouter~sharedRouter~statisticsRouter
 * @inner
 * @namespace getQuestionnaires
 */

const Logger = require('../../../services/logger')
const mongoose = require('mongoose')
const { DailyMoods } = require('../../../models/dailyMoods')
const { isTeacher, Roles } = require('../../../models/roles')
const { Users } = require('../../../models/users')

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
    const { fromDate, toDate, classFilter } = req.body

    if (!fromDate || !toDate) return res.status(400).json({ message: 'Date range missing' })
    if (!classFilter) return res.status(400).json({ message: 'Class filter missing' })
    if (!mongoose.Types.ObjectId.isValid(classFilter) && classFilter !== 'all') {
      return res.status(400).json({ message: 'Class is wrong, either an id or \'all\' required' })
    }

    const agg = buildAggregation(fromDate, toDate)
    const response = {}

    const userIdsFromClassFilter = await getUsersFromClassFilter(req.user, classFilter)
    if (!userIdsFromClassFilter) return res.status(400).json({ message: 'User not in this class' })
    const moods = await DailyMoods.find({ ...agg, user: { $in: userIdsFromClassFilter } })
    let average = 0

    for (const mood of moods) {
      const date = (new Date(mood.date)).toISOString().split('T')[0]
      response[date] = mood.mood
      average += mood.mood
    }
    response.averagePercentage = moods.length > 0 ? average / moods.length * 20 : 'NaN'

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

const getUsersFromClassFilter = async (user, classFilter) => {
  const studentRole = await Roles.findOne({ name: 'student' })
  const agg = { role: studentRole._id, facility: user.facility }
  if (classFilter !== 'all') {
    if (user.classes.some(c => c.equals(classFilter))) return null
    agg.classes = classFilter
    return (await Users.find(agg)).map((user) => user._id)
  }
  if (await isTeacher(user)) {
    agg.classes = user.classes
  }

  return (await Users.find(agg)).map((user) => user._id)
}
