/**
 * @memberof module:router~mainRouter~admRouter~helpNumbersRouter
 * @inner
 * @namespace register
 */

const { HelpNumbers, validateHelpNumbers } = require('../../../models/helpNumbers')
const Logger = require('../../../services/logger')

/**
 * Main register function
 * @name POST /adm/helpNumber/register
 * @function
 * @memberof module:router~mainRouter~admRouter~helpNumbersRouter~register
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 400 if invalid requests
 * @returns 422 if name passed as parameter is already used
 * @returns 422 if there is no email and no telephone
 * @returns 200 if OK
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    // Verif received data
    const { error } = validateHelpNumbers(req.body)
    if (error) {
      return res.status(400).json({ message: 'Invalid request' })
    }
    if (!req.body.email && !req.body.telephone) {
      return res.status(422).json({ message: 'At least email or telephone have to be present' })
    }
    const tmp = await HelpNumbers.findOne({
      name: req.body.name,
      facility: req.user.facility._id
    })
    if (tmp) return res.status(422).json({ message: 'This name is already used' })

    const newHelpNumber = new HelpNumbers({
      name: req.body.name,
      telephone: req.body.telephone,
      email: req.body.email,
      helpNumbersCategory: req.body.helpNumbersCategory,
      description: req.body.description,
      facility: req.user.facility._id
    })
    await newHelpNumber.save()

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
