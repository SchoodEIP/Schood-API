/**
 * @memberof module:router~mainRouter~desanonymsRouter
 * @inner
 * @namespace desanonyms
 */

const { default: mongoose } = require('mongoose')
const { validateDesanonyms, Desanonyms } = require('../../../models/desanonym')
const { Users } = require('../../../models/users')
const { createNotification } = require('../../../services/notification')

/**
 * Main desanonyms function
 * @name POST /shared/desanonyms
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
    const { error } = validateDesanonyms(req.body)
    if (error) {
      return res.status(400).json({ message: 'Invalid request' })
    }
    const userConcerned = req.body.user

    const user = await Users.findById(userConcerned)
    if (!user) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    const desanonym = new Desanonyms({
      user: req.body.user,
      createdBy: new mongoose.Types.ObjectId(req.user._id),
      message: req.body.message ? req.body.message : '',
      reason: req.body.reason ? req.body.reason : '',
      facility: req.user.facility
    })
    await desanonym.save()

    await createNotification(req.body.user, 'Nouvelle demande de désanonymisation', 'Une nouvelle demande de désanonymisation à été créé par ' + req.user.firstname + ' ' + req.user.lastname, 'desanonyms', desanonym._id, req.user.facility)

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
