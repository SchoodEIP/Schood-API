/**
 * @memberof module:router~mainRouter~teacherRouter
 * @inner
 * @namespace questionnaire
 */

const { Questionnaire, Types } = require('../../../models/questionnaire')

/**
 * Main update questionnaire function
 * @name PATCH /teacher/questionnaire/:id
 * @function
 * @memberof module:router~mainRouter~teacherRouter~questionnaire
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK and return access token and role name
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const questionnaireId = req.params.id
    // Verif received data
    const questionnaire = await Questionnaire.findById(questionnaireId)

    if (new Date(questionnaire.fromDate) < new Date()) {
        return res.status(400).json({message: "You cannot modify a questionnaire from current or previous weeks"})
    }
    let error = false;
    if (req.body.questions) {
        req.body.questions.forEach(question => {
            if (!question.title || !Object.values(Types).includes(question.type)) {
                error = true
            }
        });
        if (error) {
            return res.status(400).json({message: "Invalid question"})
        }
    }

    // Modify questionnaire
    questionnaire.title = req.body.title ? req.body.title : questionnaire.title
    questionnaire.questions = req.body.questions ? req.body.questions : questionnaire.questions
    await questionnaire.save()

    // Send profile
    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
