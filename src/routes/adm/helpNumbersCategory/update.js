/**
 * @memberof module:router~mainRouter~admRouter
 * @inner
 * @namespace helpNumbersCategory/update
 */

const { HelpNumbersCategories, validateHelpNumbersCategories } = require('../../../models/helpNumbersCategories')
const mongoose = require('mongoose')

/**
 * Main update function
 * @name PATCH /adm/helpNumbersCategory/:id
 * @function
 * @memberof module:router~mainRouter~admRouter~helpNumbersCategory/update
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
      return res.status(400).json({ message: 'Invalid request' })
    }
    const id = req.params.id

    if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid request' })

    const tmp = await HelpNumbersCategories.findOne({ name: req.body.name })
    if (tmp) return res.status(422).json({ message: 'This name is already used' })

    const helpNumbersCategory = await HelpNumbersCategories.findOne({ _id: id, facility: req.user.facility })
    if (!helpNumbersCategory || helpNumbersCategory.length === 0) {
      return res.status(422).json({ message: 'This helpNumbersCategory do not exist' })
    }

    helpNumbersCategory.name = req.body.name
    await helpNumbersCategory.save()

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
