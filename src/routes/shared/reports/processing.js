/**
 * @memberof module:router~mainRouter~reportsRouter
 * @inner
 * @namespace reports
 */

const { Reports } = require('../../../models/reports')

/**
 * Main reports function
 * @name POST /shared/reports
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
    // Verif received data
    const id = req.params.id

    const check = await Reports.findById(id)

    if (!check) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    check.status = req.body.status
    check.responseMessage = req.body.responseMessage

    await check.save();

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
