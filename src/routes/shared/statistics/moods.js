/**
 * @memberof module:router~mainRouter~sharedRouter~statisticsRouter
 * @inner
 * @namespace moods
 */

const Logger = require('../../../services/logger')
const mongoose = require('mongoose')
const { isTeacher, Roles } = require('../../../models/roles')
const { Users } = require('../../../models/users')
const { Classes } = require('../../../models/classes')
const { Moods } = require('../../../models/moods')

/**
 * Main moods statistics function
 * @name GET /shared/statistics/moods
 * @function
 * @memberof module:router~mainRouter~sharedRouter~statisticsRouter~moods
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK and return the average mood percentage and the average mood for each date
 * @returns 400 if one of the parameter is missing or is wrong
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
    if (classFilter !== 'all') {
      const _class = await Classes.findOne({ _id: classFilter, facility: req.user.facility })
      if (!_class) return res.status(400).json({ message: 'Class filtered is not an existing class' })
    }

    const agg = buildAggregation(fromDate, toDate)
    const response = {}

    const userIdsFromClassFilter = await getUsersFromClassFilter(req.user, classFilter)
    if (!userIdsFromClassFilter) return res.status(400).json({ message: 'User is not part of this class' })
    const moods = await Moods.find({ ...agg, user: { $in: userIdsFromClassFilter } })
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

const getUsersFromClassFilter = async (user, classFilter) => {
  const studentRole = await Roles.findOne({ name: 'student' })
  const agg = { role: studentRole._id, facility: user.facility }

  if (classFilter !== 'all') {
    if (await isTeacher(user) && !(user.classes.some(c => c.equals(classFilter)))) return null
    agg.classes = classFilter
    return (await Users.find(agg)).map((user) => user._id)
  }

  if (await isTeacher(user)) {
    agg.classes = { $in: user.classes.map((c) => c._id) }
  }

  return (await Users.find(agg)).map((user) => user._id)
}
