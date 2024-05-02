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
 * @returns 200 if OK and return the number of answers
 * @returns 422 if an errors occurs on fetching roles
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const { fromDate, toDate, ids } = req.body

    if (!ids || ids.length === 0) return res.status(401).json({ message: 'No questionnaire id provided' })
    if (!(await verifyQuestionnaire(req.user.facility, ids))) {
      return res.status(401).json({ message: 'Bad questionnaire id provided' })
    }

    const agg = buildAggregation(fromDate, toDate)
    const response = {}
    for (const questionnaireId of ids) {
      const nb = await getAnswersNumberFromQuestionnaire(questionnaireId, agg)
      if (nb < 0) return res.status(422).json({ message: 'Failed to get answers' })
      response[questionnaireId] = nb
    }

    return res.status(200).json(response)
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

const buildAggregation = (fromDate, toDate) => {
  const agg = {}

  const convertedFromDate = new Date(fromDate)
  if (fromDate && convertedFromDate !== null) {
    agg.fromDate = {
      $gte: convertedFromDate
    }
  }

  const convertedToDate = new Date(toDate)
  if (toDate && convertedToDate !== null) {
    agg.toDate = {
      $lte: convertedToDate
    }
  }
  return agg
}

const verifyQuestionnaire = async (userFacility, ids) => {
  const questionnaires = await Questionnaires.find({ _id: { $in: ids } })

  for (const questionnaire of questionnaires) {
    if (!questionnaire.facility.equals(userFacility)) return false
  }
  return true
}

const getAnswersNumberFromQuestionnaire = async (questionnaireId, agg) => {
  const response = await Answers.find({ ...agg, questionnaire: questionnaireId })

  if (!response) return -1
  return response.length
}
