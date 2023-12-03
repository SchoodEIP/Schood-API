/**
 * @memberof module:router~mainRouter~reportsRouter
 * @inner
 * @namespace reports
 */

const { default: mongoose } = require("mongoose")
const { Reports } = require("../../../models/reports")

/**
 * Main reports function
 * @name GET /shared/reports
 * @function
 * @memberof module:router~mainRouter~reportsRouter~reports
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
    const query = {
        facility: req.user.facility
    }

    if (req.user.role.levelOfAccess <= 1) {
        query['signaledBy'] = req.user._id
    }
    const reports = await Reports.find(query)

    return res.status(200).json(reports)
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
