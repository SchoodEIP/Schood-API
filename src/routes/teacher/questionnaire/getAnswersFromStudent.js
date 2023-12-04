/**
 * @memberof module:router~mainRouter~teacherRouter
 * @inner
 * @namespace questionnaire
 */

const { default: mongoose } = require('mongoose')
const { Answers } = require('../../../models/answers')
const Logger = require('../../../services/logger')

/**
 * Main getAnswersFromStudent function
 * @name GET /teacher/questionnaire/:id/answers/:studentId
 * @function
 * @memberof module:router~mainRouter~teacherRouter~questionnaire~getAnswersFromStudent
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK and return access token and role name
 * @returns 400 if invalid arguments
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    // Verif received data
    const questionnaireId = req.params.id
    const studentId = req.params.studentId
    if ((!questionnaireId || !mongoose.Types.ObjectId.isValid(questionnaireId) ||
    !studentId || !mongoose.Types.ObjectId.isValid(studentId))) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    const agg = [
      {
        $match: {
          questionnaire: new mongoose.Types.ObjectId(questionnaireId),
          createdBy: new mongoose.Types.ObjectId(studentId)
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy'
        }
      },
      {
        $unwind: {
          path: '$createdBy',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          'createdBy.password': 0,
          'createdBy.firstConnexion': 0,
          'createdBy.role': 0,
          'createdBy.facility': 0
        }
      }
    ]

    const answers = await Answers.aggregate(agg)

    // Send answers
    return res.status(200).json(answers[0])
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
