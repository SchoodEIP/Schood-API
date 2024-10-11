/**
 * @memberof module:router~mainRouter~sharedRouter
 * @inner
 * @namespace questionnaire
 */

const { default: mongoose } = require('mongoose')
const { Answers } = require('../../../models/answers')
const Logger = require('../../../services/logger')
const { Users } = require('../../../models/users')

/**
 * Main questionnaire informations function
 * @name GET /shared/questionnaire/getstudentQuestionnairesInformations/:id
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
    const studentId = req.params.id
    const levelOfAccess = req.user.role.levelOfAccess
    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) return res.status(400).json({ message: 'Invalid request' })
    const student = await Users.findById(studentId)
    if (!student || student.length === 0) {
      return res.status(422).json({ message: 'User not found' })
    }
    const answers = await Answers.find({createdBy: student._id}).populate('questionnaire').populate({
      path: 'questionnaire',
      populate: [
        {
          path: 'createdBy'
        }
      ]
    })
    const questionnaires = []

    answers.forEach(answer => {
      // Remove unnecessary data
      if (answer.questionnaire.fromDate) {
        answer.questionnaire.fromDate = undefined
      }
      if (answer.questionnaire.toDate) {
        answer.questionnaire.toDate = undefined
      }
      if (answer.questionnaire.questions) {
        answer.questionnaire.questions = undefined
      }
      if (answer.questionnaire.classes) {
        answer.questionnaire.classes = undefined
      }
      if (answer.questionnaire.facility) {
        answer.questionnaire.facility = undefined
      }
      if (answer.questionnaire.__v) {
        answer.questionnaire.__v = undefined
      }
    
      if (levelOfAccess === 2 || (levelOfAccess === 1 && String(answer.questionnaire.createdBy._id) === String(req.user._id))) {
        if (answer.questionnaire.createdBy) {
          answer.questionnaire.createdBy = undefined
        }
        questionnaires.push(answer.questionnaire)
      }
    });

    // Send questionnaire
    return res.status(200).json(questionnaires)
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
