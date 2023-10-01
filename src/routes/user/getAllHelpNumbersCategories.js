/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace getAllHelpNumbersCategories
 */

const { HelpNumbersCategories } = require('../../models/helpNumbersCategories')

/**
 * Main getAllHelpNumbersCategories function
 * @name GET /user/helpNumbersCategories
 * @function
 * @memberof module:router~mainRouter~userRouter~getAllHelpNumbersCategories
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
      }
    ]
    const result = await HelpNumbersCategories.aggregate(agg)

    return res.status(200).json(result)
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
