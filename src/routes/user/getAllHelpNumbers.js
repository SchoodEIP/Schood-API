/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace getAllHelpNumbers
 */

const { HelpNumbers } = require('../../models/helpNumbers')

/**
 * Main getAllUsers function
 * @name GET /user/helpNumbers
 * @function
 * @memberof module:router~mainRouter~userRouter~getAllHelpNumbers
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const agg = [
      {
        $match: {
          facility: req.user.facility
        }
      },
      {
        $project: {
          __v: 0
        }
      }
    ]
    const result = await HelpNumbers.aggregate(agg)

    return res.status(200).json(result)
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
