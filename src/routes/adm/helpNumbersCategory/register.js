/**
 * @memberof module:router~mainRouter~admRouter
 * @inner
 * @namespace helpNumbersCategory/register
 */

const { HelpNumbersCategories, validateHelpNumbersCategories } = require('../../../models/helpNumbersCategories')

/**
 * Main register function
 * @name POST /adm/helpNumbersCategory/register
 * @function
 * @memberof module:router~mainRouter~admRouter~helpNumbersCategory/register
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 400 if invalid requests
 * @returns 422 if name passed as parameter is already used
 * @returns 200 if OK
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    // Verif received data
    const { error } = validateHelpNumbersCategories(req.body)
    if (error) {
      console.log(error)
      return res.status(400).json({ message: 'Invalid request' })
    }
    const tmp = await HelpNumbersCategories.findOne({ name: req.body.name })
    if (tmp) return res.status(422).json({ message: 'This name is already used' })

    const newHelpNumbersCategory = new HelpNumbersCategories({
      name: req.body.name,
      facility: req.user.facility._id
    })
    await newHelpNumbersCategory.save()

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
