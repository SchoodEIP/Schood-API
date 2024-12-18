/**
 * @memberof module:router~mainRouter~desanonymsRouter
 * @inner
 * @namespace desanonyms
 */

const { default: mongoose } = require('mongoose')
const { Desanonyms } = require('../../../models/desanonym')

/**
 * Main desanonyms function
 * @name DELETE /shared/desanonyms
 * @function
 * @memberof module:router~mainRouter~desanonymsRouter~desanonyms
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK and return access token and role name
 * @returns 400 if Invalid arguments
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    // Verif received data
    const id = req.params.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    if (!await Desanonyms.findByIdAndDelete(id)) { return res.status(400).json({ message: 'Invalid request' }) }

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
