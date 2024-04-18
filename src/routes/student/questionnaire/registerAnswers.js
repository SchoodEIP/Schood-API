/**
 * @memberof module:router~mainRouter~studentRouter
 * @inner
 * @namespace questionnaire
 */

const { default: mongoose } = require('mongoose')
const { Questionnaires } = require('../../../models/questionnaire')
const { validateAnswers, Answers } = require('../../../models/answers')
const Logger = require('../../../services/logger')

/**
 * Main questionnaire function
 * @name POST /student/questionnaire/:id
 * @function
 * @memberof module:router~mainRouter~studentRouter~questionnaire
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
    const questionnaireId = req.params.id
    if (!mongoose.Types.ObjectId.isValid(questionnaireId)) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    // Check if questionnaire exist and is currently valid
    const questionnaire = await Questionnaires.findById(questionnaireId)

    const startWeekToday = new Date()
    startWeekToday.setDate(startWeekToday.getDate() - startWeekToday.getDay() + 1)

    const endWeekToday = new Date(startWeekToday)
    endWeekToday.setDate(endWeekToday.getDate() + 6)

    startWeekToday.setUTCHours(0, 0, 0, 0)
    endWeekToday.setUTCHours(23, 59, 59, 59)
    if (!questionnaire || new Date(questionnaire.fromDate) < startWeekToday || new Date(questionnaire.toDate) > endWeekToday) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    // Check if not already answered
    const answersCheck = await Answers.findOne({ questionnaire: questionnaireId, createdBy: req.user._id })
    if (answersCheck) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    // Check if answers valid
    const { error } = validateAnswers(req.body)
    if (error) {
      return res.status(400).json({ message: 'Invalid request' })
    }
    let errorAnswers = false
    req.body.answers.forEach(answer => {
      let present = false
      questionnaire.questions.forEach(question => {
        if (question._id.equals(answer.question)) {
          present = true
        }
      })
      if (!present) {
        errorAnswers = true
      }
    })
    if (errorAnswers) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    // Save answers
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    const answers = new Answers({
      questionnaire: questionnaireId,
      date: today,
      answers: req.body.answers,
      createdBy: req.user._id
    })

    await answers.save()

    // Send profile
    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
