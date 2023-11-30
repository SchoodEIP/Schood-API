/**
 * @memberof module:router~mainRouter~admRouter~helpNumbersRouter
 * @inner
 * @namespace delete
 */

const { HelpNumbers } = require('../../../models/helpNumbers')
const mongoose = require('mongoose')

/**
 * Main delete function
 * @name DELETE /adm/helpNumber/:id
 * @function
 * @memberof module:router~mainRouter~admRouter~helpNumbersRouter~delete
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
    const id = req.params.id

    if (!id && !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid request' })

    await HelpNumbers.findOneAndRemove({ _id: id })
    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
