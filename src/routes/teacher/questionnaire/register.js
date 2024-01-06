/**
 * @memberof module:router~mainRouter~teacherRouter
 * @inner
 * @namespace questionnaire
 */

const { validateQuestionnaire, Questionnaires, Types } = require('../../../models/questionnaire')
const Logger = require('../../../services/logger')

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

    const date = new Date(req.body.date)
    const fromDate = new Date(date.setDate(date.getDate() - date.getDay()))
    const toDate = new Date(date.setDate(date.getDate() - date.getDay() + 6))
    fromDate.setUTCHours(0, 0, 0, 0)
    toDate.setUTCHours(0, 0, 0, 0)

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
      createdBy: req.user._id
    })
    await questionnaire.save()

    date = new Date()

    for (let index = 0; index < req.body.classes.length; index++) {
      const _class = req.body.classes[index]

      await createNotificationForAllStudentOfClass(_class, 'Un nouveau questionnaire est disponible', 'Le questionnaire du ' + date.toDateString() + ' par ' + req.user.firstname + ' ' + req.user.lastname + ' est disponible', 'questionnaire', questionnaire._id, req.user.facility)
    }

    // Send profile
    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
