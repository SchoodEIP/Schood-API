/**
 * @memberof module:router~mainRouter~sharedRouter
 * @inner
 * @namespace questionnaire
 */

const { Answers } = require('../../../models/answers')
const { Questionnaires } = require('../../../models/questionnaire')
const { Roles } = require('../../../models/roles')
const { Users } = require('../../../models/users')
const Logger = require('../../../services/logger')

/**
 * Main questionnaire function
 * @name GET /shared/questionnaire/statusLastTwo/
 * @function
 * @memberof module:router~mainRouter~sharedRouter~questionnaire
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK and return access token and role name
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const isTeacher = req.user.role.levelOfAccess === 1
    const isStudent = req.user.role.levelOfAccess === 0
    const studentRole = await Roles.findOne({ name: 'student' })

    const result = { q1: { completion: 0, id: '', title: '' }, q2: { completion: 0, id: '', title: '' } }

    if (isStudent) {
      const classes = req.user.classes.map((class_) => String(class_._id))
      const questionnaires = await Questionnaires.find({ classes: { $in: classes } }).sort({ toDate: -1 })

      if (questionnaires.length > 0) {
        if (questionnaires.length === 1) {
          const answers = await Answers.findOne({ questionnaire: questionnaires[0]._id })

          if (answers) {
            result.q1.completion = answers.answers.length * 100 / questionnaires[0].questions.length
            result.q1.id = questionnaires[0]._id
            result.q1.title = questionnaires[0].title
          }
        } else if (questionnaires.length > 1) {
          const answers1 = await Answers.findOne({ questionnaire: questionnaires[0]._id })
          const answers2 = await Answers.findOne({ questionnaire: questionnaires[1]._id })

          if (answers1) {
            result.q1.completion = answers1.answers.length * 100 / questionnaires[0].questions.length
            result.q1.id = questionnaires[0]._id
            result.q1.title = questionnaires[0].title
          }

          if (answers2) {
            result.q2.completion = answers2.answers.length * 100 / questionnaires[1].questions.length
            result.q2.id = questionnaires[1]._id
            result.q2.title = questionnaires[1].title
          }
        }
      }
    } else if (isTeacher) {
      const questionnaires = await Questionnaires.find({ createdBy: req.user._id }).sort({ toDate: -1 })

      if (questionnaires.length > 0) {
        if (questionnaires.length === 1) {
          const answers = await Answers.find({ questionnaire: questionnaires[0]._id, facility: req.user.facility })
          const students = await Users.find({ classes: { $in: questionnaires[0].classes }, facility: req.user.facility, role: studentRole._id })

          if (answers) {
            result.q1.completion = answers.length * 100 / students.length
            result.q1.id = questionnaires[0]._id
            result.q1.title = questionnaires[0].title
          }
        } else if (questionnaires.length > 1) {
          const answers1 = await Answers.find({ questionnaire: questionnaires[0]._id, facility: req.user.facility })
          const answers2 = await Answers.find({ questionnaire: questionnaires[1]._id, facility: req.user.facility })
          const students1 = await Users.find({ classes: { $in: questionnaires[0].classes }, facility: req.user.facility, role: studentRole._id })
          const students2 = await Users.find({ classes: { $in: questionnaires[1].classes }, facility: req.user.facility, role: studentRole._id })

          if (answers1) {
            result.q1.completion = answers1.length * 100 / students1.length
            result.q1.id = questionnaires[0]._id
            result.q1.title = questionnaires[0].title
          }

          if (answers2) {
            result.q2.completion = answers2.length * 100 / students2.length
            result.q2.id = questionnaires[1]._id
            result.q2.title = questionnaires[1].title
          }
        }
      }
    } else {
      return res.status(400).json({ message: 'Invalid request' })
    }

    // Send questionnaires
    return res.status(200).json(result)
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
