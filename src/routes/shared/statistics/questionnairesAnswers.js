/**
 * @memberof module:router~mainRouter~sharedRouter~statisticsRouter
 * @inner
 * @namespace answers
 */

const Logger = require('../../../services/logger')
const { Questionnaires } = require('../../../models/questionnaire')
const { Answers } = require('../../../models/answers')
const { isTeacher } = require('../../../models/roles')
const mongoose = require('mongoose')
const { Classes } = require('../../../models/classes')

/**
 * Main statistics answers function
 * @name GET /shared/statistics/answers
 * @function
 * @memberof module:router~mainRouter~sharedRouter~statisticsRouter~answers
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK and return the percentage of answers for each day
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

    const aggQuestionnaires = await buildAggregationQuestionnaires(fromDate, toDate, req.user, classFilter)
    if (!aggQuestionnaires) return res.status(400).json({ message: 'User is not part of this class' })

    const questionnaires = await Questionnaires.find(aggQuestionnaires)
    const answers = await Answers.find({
      questionnaire: { $in: questionnaires.map((q) => q._id) }
    })
    const response = createResponse(questionnaires, answers)

    return res.status(200).json(response)
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

const buildAggregationQuestionnaires = async (fromDate, toDate, user, classFilter) => {
  const agg = { facility: user.facility, fromDate: {}, toDate: {} }
  if (await isTeacher(user)) {
    agg.createdBy = user._id
  }
  if (classFilter !== 'all') {
    if (await isTeacher(user) && !(user.classes.some(c => c.equals(classFilter)))) return null
    agg.classes = { $in: classFilter }
  } else {
    if (await isTeacher(user)) {
      agg.classes = { $in: user.classes.map((c) => c._id) }
    }
  }

  const convertedFromDate = new Date(fromDate)
  if (fromDate && convertedFromDate !== null) {
    agg.fromDate.$gte = convertedFromDate
  }

  const convertedToDate = new Date(toDate)
  if (toDate && convertedToDate !== null) {
    agg.toDate.$lte = convertedToDate
  }
  return agg
}

const createResponse = (questionnaires, answers) => {
  const daysPercentage = {}
  const answeredQuestions = {}
  let nbQuestions = 0

  questionnaires.forEach((questionnaire) => {
    for (const question of questionnaire.questions) {
      nbQuestions += 1
      // Assign each question answered to the related date
      for (const answer of answers) {
        const questionIds = getQuestionIdsFromAnswer(answer)
        if (questionIds.some(id => id.equals(question._id))) {
          const date = (new Date(answer.date)).toISOString().split('T')[0]
          if (!answeredQuestions[date]) answeredQuestions[date] = []
          answeredQuestions[date].push(question._id)
        }
      }
    }
  })
  // Compute the percentage of answer for the question and assign it to the related date
  for (const day of Object.keys(answeredQuestions)) {
    if (!daysPercentage[day]) daysPercentage[day] = 0
    daysPercentage[day] += (answeredQuestions[day].length / nbQuestions * 100) / answers.length
  }

  return daysPercentage
}

const getQuestionIdsFromAnswer = (answer) => {
  return answer.answers.map(a => a.question)
}
