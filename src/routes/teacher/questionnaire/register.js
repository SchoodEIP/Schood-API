/**
 * @memberof module:router~mainRouter~teacherRouter
 * @inner
 * @namespace questionnaire
 */

const { validateQuestionnaire, Questionnaires, Types } = require('../../../models/questionnaire')
const Logger = require('../../../services/logger')
const { createNotificationForAllStudentOfClass } = require('../../../services/notification')

/**
 * Main questionnaire function
 * @name POST /teacher/questionnaire
 * @function
 * @memberof module:router~mainRouter~teacherRouter~questionnaire
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
    const { error } = validateQuestionnaire(req.body)
    if (error) {
      Logger.error(error)
      return res.status(400).json({ message: 'Invalid request' })
    }

    let date = new Date(req.body.date)

    const fromDate = new Date(date)
    fromDate.setDate(date.getDate() - date.getDay() + 1)
    fromDate.setUTCHours(0, 0, 0, 0)

    const toDate = new Date(date)
    toDate.setDate(fromDate.getDate() + 6)
    toDate.setUTCHours(23, 59, 59, 59)

    const check = await Questionnaires.findOne({ createdBy: req.user._id, fromDate, toDate })

    if (check) {
      return res.status(400).json({ message: 'There is already a Questionnaire at this week for this teacher' })
    }

    let errorQuestions = false
    req.body.questions.forEach(question => {
      if (question.type === Types.MULTIPLE) {
        if (!question.answers) {
          errorQuestions = true
        }
      }
    })

    if (errorQuestions) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    const questionnaire = new Questionnaires({
      title: req.body.title,
      fromDate,
      toDate,
      questions: req.body.questions,
      classes: req.user.classes,
      createdBy: req.user._id,
      facility: req.user.facility
    })
    await questionnaire.save()

    date = new Date()

    for (let index = 0; index < req.user.classes.length; index++) {
      const _class = req.user.classes[index]

      await createNotificationForAllStudentOfClass(_class, 'Un nouveau questionnaire est disponible', 'Le questionnaire du ' + date.toLocaleDateString('fr-FR') + ' par ' + req.user.firstname + ' ' + req.user.lastname + ' est disponible', 'questionnaire', questionnaire._id, req.user.facility)
    }

    // Send profile
    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
