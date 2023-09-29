/**
 * @memberof module:router~mainRouter~teacherRouter
 * @inner
 * @namespace questionnaire
 */

const { default: mongoose } = require('mongoose')
const { Answers } = require('../../../models/answers')

/**
 * Main getAnswers function
 * @name GET /teacher/questionnaire/:id/answers
 * @function
 * @memberof module:router~mainRouter~teacherRouter~questionnaire~answers
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
    if (!questionnaireId || !mongoose.Types.ObjectId.isValid(questionnaireId)) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    const agg = [
      {
        $match: {
          questionnaire: new mongoose.Types.ObjectId(questionnaireId)
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
      },
      {
        $group: {
          _id: 1,
          users: {
            $push: '$$ROOT.createdBy'
          }
        }
      }
    ]

    const students = await Answers.aggregate(agg)

    // Send students
    return res.status(200).json(students[0])
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
