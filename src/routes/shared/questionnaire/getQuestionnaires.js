/**
 * @memberof module:router~mainRouter~sharedRouter
 * @inner
 * @namespace questionnaire
 */

const { Questionnaires } = require('../../../models/questionnaire')
const Logger = require('../../../services/logger')

/**
 * Main questionnaire function
 * @name GET /shared/questionnaire/
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
    let questionnaires

    if (isTeacher) { // If teacher we only want his questionnaires
      questionnaires = await Questionnaires.find({
        facility: req.user.facility,
        classes: { $in: req.user.classes },
        createdBy: req.user._id
      }).sort({ date: -1 }).populate('createdBy classes')
    } else { // If student we want all questionnairs for his class
      questionnaires = await Questionnaires.find({
        facility: req.user.facility,
        classes: { $in: req.user.classes }
      }).sort({ date: -1 }).populate('createdBy classes')
    }

    const result = []

    // Remove unnecessary data
    questionnaires.forEach(questionnaire => {
      if (questionnaire) {
        questionnaire.questions = undefined
        if (questionnaire.createdBy) {
          questionnaire.createdBy.password = undefined
          questionnaire.createdBy.classes = undefined
          questionnaire.createdBy.firstConnexion = undefined
          questionnaire.createdBy.facility = undefined
          questionnaire.createdBy.role = undefined
        }
        questionnaire.classes.forEach(class_ => {
          class_.facility = undefined
        })

        const r = result.find((r) => new Date(r.fromDate).getTime() === new Date(questionnaire.fromDate).getTime() && new Date(r.toDate).getTime() === new Date(questionnaire.toDate).getTime())

        if (!r) {
          result.push({
            fromDate: questionnaire.fromDate,
            toDate: questionnaire.toDate,
            questionnaires: [questionnaire]
          })
        } else {
          r.questionnaires.push(questionnaire)
        }
      }
    })

    result.sort((a, b) => {
      return new Date(b.fromDate).getTime() - new Date(a.toDate).getTime()
    })

    // Send questionnaires
    return res.status(200).json(result)
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
