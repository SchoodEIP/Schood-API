/**
 * @memberof module:router~mainRouter~studentRouter
 * @inner
 * @namespace questionnaire
 */

const { default: mongoose } = require('mongoose')
const { Questionnaires } = require('../../../models/questionnaire')
const { Answers } = require('../../../models/answers')
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

    // Check if questionnaire exist
    const questionnaire = await Questionnaires.findById(questionnaireId)
    if (!questionnaire) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    const answers = await Answers.findOne({ questionnaire: questionnaireId, createdBy: req.user._id })

    // Send answers
    return res.status(200).json(answers)
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
