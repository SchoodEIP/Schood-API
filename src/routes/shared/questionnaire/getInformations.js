/**
 * @memberof module:router~mainRouter~sharedRouter
 * @inner
 * @namespace questionnaire
 */

const { Questionnaire } = require('../../../models/questionnaire')
const Logger = require('../../../services/logger')

/**
 * Main questionnaire informations function
 * @name GET /shared/questionnaire/:id
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
    const questionnaireId = req.params.id
    const questionnaire = await Questionnaire.findById(questionnaireId).populate('createdBy classes')

    // Remove unnecessary data
    questionnaire.createdBy.password = undefined
    questionnaire.createdBy.classes = undefined
    questionnaire.createdBy.firstConnexion = undefined
    questionnaire.createdBy.facility = undefined
    questionnaire.createdBy.role = undefined
    questionnaire.classes.forEach(class_ => {
      class_.facility = undefined
    })

    // Send questionnaire
    return res.status(200).json(questionnaire)
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
