/**
 * @memberof module:router~mainRouter~sharedRouter
 * @inner
 * @namespace questionnaire
 */

const { Questionnaire } = require('../../../models/questionnaire')

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
 * @returns 400 if Invalid arguments
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const isTeacher = req.user.role.levelOfAccess === 1 ? true : false
    let questionnaires 
    
    if (isTeacher) { // If teacher we only want his questionnaires
        questionnaires = await Questionnaire.find({
            facility: req.user.facility,
            classes: {$in: req.user.classes},
            createdBy: req.user._id
        }).sort({date: -1}).populate("createdBy classes")
    } else { // If student we want all questionnairs for his class
        questionnaires = await Questionnaire.find({
            facility: req.user.facility,
            classes: {$in: req.user.classes}
        }).sort({date: -1}).populate("createdBy classes")
    }

    // Remove unnecessary data
    questionnaires.forEach(questionnaire => {
        questionnaire.questions = undefined
        questionnaire.createdBy.password = undefined
        questionnaire.createdBy.classes = undefined
        questionnaire.createdBy.firstConnexion = undefined
        questionnaire.createdBy.facility = undefined
        questionnaire.createdBy.role = undefined
        questionnaire.classes.forEach(class_ => {
            class_.facility = undefined
        });
    });

    // Send questionnaires
    return res.status(200).json(questionnaires)
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
