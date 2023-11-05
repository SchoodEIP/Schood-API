/**
 * @memberof module:router~mainRouter~admRouter
 * @inner
 * @namespace helpNumber/update
 */
const { HelpNumbers, validateHelpNumbers } = require('../../../models/helpNumbers')
const { Mongoose } = require('mongoose')

/**
 * Main update function
 * @name PATCH /adm/helpNumber/:id
 * @function
 * @memberof module:router~mainRouter~admRouter~helpNumber/update
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

    if (!id && !Mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid request' })

    const { error } = validateHelpNumbers(req.body)
    if (error) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    const helpNumberToUpdate = await HelpNumbers.findOne({ _id: id })
    if (!helpNumberToUpdate) return res.status(422).json({ message: 'Class not found' })
    const tmp = await HelpNumbers.findOne({
      name: req.body.name,
      facility: req.user.facility._id
    })
    if (tmp && tmp._id !== id) return res.status(422).json({ message: 'This name is already used' })

    if (req.body.name) helpNumberToUpdate.name = req.body.name
    if (req.body.telephone) helpNumberToUpdate.telephone = req.body.telephone
    if (req.body.email) helpNumberToUpdate.email = req.body.email
    if (req.body.helpNumbersCategory) helpNumberToUpdate.helpNumbersCategory = req.body.helpNumbersCategory
    if (req.body.description) helpNumberToUpdate.description = req.body.description
    await helpNumberToUpdate.save()

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
