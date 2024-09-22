/**
 * @memberof module:router~mainRouter~admRouter~helpNumbersRouter
 * @inner
 * @namespace update
 */
const { HelpNumbers, validateHelpNumbers } = require('../../../models/helpNumbers')
const { HelpNumbersCategories } = require('../../../models/helpNumbersCategories')
const mongoose = require('mongoose')
const Logger = require('../../../services/logger')

/**
 * Main update function
 * @name PATCH /adm/helpNumber/:id
 * @function
 * @memberof module:router~mainRouter~admRouter~helpNumbersRouter~update
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 400 if invalid requests
 * @returns 200 if OK
 * @returns 422 if helpNumber not found or name already used
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    // Verif received data
    const id = req.params.id

    if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid request' })

    const { error } = validateHelpNumbers(req.body)
    if (error) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    const helpNumberToUpdate = await HelpNumbers.findOne({ _id: id, facility: req.user.facility._id })
    if (!helpNumberToUpdate) return res.status(422).json({ message: 'Class not found' })
    const tmp = await HelpNumbers.findOne({
      name: req.body.name,
      facility: req.user.facility._id,
      _id: { $nin: [id] }
    })
    if (tmp && tmp._id !== id) return res.status(422).json({ message: 'This name is already used' })

    if (req.body.name) helpNumberToUpdate.name = req.body.name
    if (req.body.telephone) helpNumberToUpdate.telephone = req.body.telephone
    if (req.body.timetable) helpNumberToUpdate.timetable = req.body.timetable
    if (req.body.email) helpNumberToUpdate.email = req.body.email
    if (req.body.informations) helpNumberToUpdate.informations = req.body.informations
    if (req.body.address) helpNumberToUpdate.address = req.body.address
    if (req.body.description) helpNumberToUpdate.description = req.body.description
    if (req.body.helpNumbersCategory && mongoose.Types.ObjectId.isValid(req.body.helpNumbersCategory)) {
      const cat = HelpNumbersCategories.findOne({ id: req.body.helpNumbersCategory })
      if (cat) helpNumberToUpdate.helpNumbersCategory = req.body.helpNumbersCategory
    }
    await helpNumberToUpdate.save()

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
