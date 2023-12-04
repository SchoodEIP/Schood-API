/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace facility
 */

const { Facilities } = require('../../models/facilities')

/**
 * Main profile function
 * @name GET /user/facility
 * @function
 * @memberof module:router~mainRouter~userRouter~facility
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK and return access token and role name
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const response = await Facilities.findById(req.user.facility)

    // Send facility
    return res.status(200).json(response)
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
