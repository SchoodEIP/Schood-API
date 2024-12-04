/**
 * @memberof module:router~mainRouter~desanonymsRouter
 * @inner
 * @namespace desanonyms
 */

const { default: mongoose } = require('mongoose')
const { Desanonyms, validateModify } = require('../../../models/desanonym')
const { Moods } = require('../../../models/moods')

/**
 * Main desanonyms function
 * @name PATCH /shared/desanonyms
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
    const { error } = validateModify(req.body)
    if (error) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    if (req.user.role.levelOfAccess === 0) {
      if (req.body.reason || req.body.message) {
        return res.status(400).json({ message: 'Invalid request' })
      }
    }

    if (req.user.role.levelOfAccess === 2) {
      if (req.body.status) {
        return res.status(400).json({ message: 'Invalid request' })
      }
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid request' })
    }
    const desanonym = await Desanonyms.findById(id)
    if (!desanonym) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    desanonym.reason = req.body.reason ? req.body.reason : desanonym.reason
    desanonym.message = req.body.message ? req.body.message : desanonym.message
    desanonym.status = req.body.status ? req.body.status : desanonym.status

    if (req.body.status && req.body.status === 'accepted') {
      const mood = await Moods.findById(desanonym.mood)

      mood.annonymous = false

      await mood.save()
    }

    await desanonym.save()

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
