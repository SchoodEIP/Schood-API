/**
 * @memberof module:router~mainRouter~teacherRouter
 * @inner
 * @namespace questionnaire
 */

const { validateQuestionnaire, Questionnaire } = require("../../models/questionnaire")

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
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
    try {
      // Verif received data
      const { error } = validateQuestionnaire(req.body)
      if (error) {
        return res.status(400).json({ message: 'Invalid request' })
      }

      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const questionnaire = new Questionnaire({
        title: req.body.title,
        date: today,
        questions: req.body.questions,
        classes: req.user.classes,
        createdBy: req.user._id
      })
      await questionnaire.save();
  
      // Send profile
      return res.status(200).send()
    } catch (error) /* istanbul ignore next */ {
      console.error(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }
  