/**
 * @memberof module:router~mainRouter~sharedRouter~statisticsRouter
 * @inner
 * @namespace getQuestionnaires
 */

const Logger = require('../../../services/logger')
const { Questionnaires } = require('../../../models/questionnaire')
const { default: mongoose } = require('mongoose')

/**
 * Main profile function
 * @name GET /shared/rolesList
 * @function
 * @memberof module:router~mainRouter~sharedRouter~rolesRouter~rolesList
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK and return an array filled with all roles
 * @returns 422 if an errors occurs on fetching roles
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const { fromDate, toDate } = req.body
    const id = req.query.id

    if (!fromDate && !toDate) {
      let response
      if (id && req.user.role.levelOfAccess === 2) {
        response = await Questionnaires.find({ createdby: id })
      } else {
        response = await Questionnaires.find()
      }

      if (!response) { return res.status(422).json({ message: 'Failed to get questionnaires' }) }
      return res.status(200).json({ numberOfQuestionnaires: response.length })
    }

    const agg = [
      {
        $match: {}
      }
    ]

    const convertedFromDate = new Date(fromDate)
    if (fromDate && convertedFromDate !== null) {
      agg[0].$match.fromDate = {
        $gte: convertedFromDate
      }
    }

    const convertedToDate = new Date(toDate)
    if (toDate && convertedToDate !== null) {
      agg[0].$match.toDate = {
        $lte: convertedToDate
      }
    }

    if (id && req.user.role.levelOfAccess === 2) {
      agg[0].$match.createdBy = new mongoose.Types.ObjectId(id)
    }

    const response = await Questionnaires.aggregate(agg)

    if (!response) { return res.status(422).json({ message: 'Failed to get roles' }) }
    return res.status(200).json({ numberOfQuestionnaires: response.length })
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
