/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace getHelpNumbersByCategory
 */

const { HelpNumbers } = require('../../models/helpNumbers')
const Logger = require('../../services/logger')
const ObjectId = require('mongoose').Types.ObjectId

/**
 * Main getAllUsers function
 * @name GET /user/helpNumbers/:id
 * @function
 * @memberof module:router~mainRouter~userRouter~getHelpNumbersByCategory
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const categoryId = req.params.id
    if (!categoryId || !ObjectId.isValid(categoryId)) return res.status(400).json({ message: 'Wrong id' })

    return res.status(200).json(await HelpNumbers.find(
      {
        facility: req.user.facility,
        helpNumbersCategory: req.params.id
      }
    ))
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
