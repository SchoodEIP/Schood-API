/**
 * @memberof module:router~mainRouter~sharedRouter~statisticsRouter
 * @inner
 * @namespace getQuestionnaires
 */

const Logger = require('../../../services/logger')
const { Questionnaires } = require('../../../models/questionnaire')
const { Answers } = require('../../../models/answers')

/**
 * Main profile function
 * @name GET /shared/rolesList
 * @function
 * @memberof module:router~mainRouter~sharedRouter~rolesRouter~rolesList
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK and return the percentage of answers for each day
 * @returns 400 if date range is missing
 * @returns 422 if the user does not belong to any class
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const { fromDate, toDate } = req.body

    if (!fromDate || !toDate) return res.status(400).json({ message: 'Date range missing' })
    if (req.user.classes.length === 0) return res.status(422).json({ message: 'User does not belongs to any class' })

    const aggQuestionnaires = buildAggregationQuestionnaires(fromDate, toDate)
    const questionnaires = await Questionnaires.find({
      ...aggQuestionnaires,
      classes: req.user.classes[0]
    })
    const answers = await Answers.find({
      questionnaire: { $in: questionnaires.map((q) => q._id) },
      createdBy: req.user._id
    })
    const response = createResponse(questionnaires, answers)

    return res.status(200).json(response)
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

const buildAggregationQuestionnaires = (fromDate, toDate) => {
  const agg = { fromDate: {}, toDate: {} }

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
      // Assign each question answered to the related date
      nbQuestions += 1
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
    daysPercentage[day] += (answeredQuestions[day].length / nbQuestions * 100)
  }

  return daysPercentage
}

const getQuestionIdsFromAnswer = (answer) => {
  return answer.answers.map(a => a.question)
}
