/**
 * @memberof module:router~mainRouter~reportsRouter
 * @inner
 * @namespace reports
 */

const { default: mongoose } = require('mongoose')
const { validateRegister, Reports } = require('../../../models/reports')
const { Users } = require('../../../models/users')
const { Chats } = require('../../../models/chat')

/**
 * Main reports function
 * @name POST /shared/reports
 * @function
 * @memberof module:router~mainRouter~reportsRouter~reports
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
    const { error } = validateRegister(req.body)
    if (error) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    const user = await Users.findById(req.body.userSignaled)
    if (!user) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    if (req.body.conversation) {
      const conversation = await Chats.findById(req.body.conversation)
      if (!conversation) {
        return res.status(400).json({ message: 'Invalid request' })
      }
    }

    const report = new Reports({
      userSignaled: new mongoose.Types.ObjectId(req.body.userSignaled),
      signaledBy: new mongoose.Types.ObjectId(req.user._id),
      createdAt: new Date(),
      message: req.body.message ? req.body.message : '',
      conversation: req.body.conversation ? new mongoose.Types.ObjectId(req.body.conversation) : null,
      type: req.body.type,
      facility: req.user.facility
    })
    await report.save()

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}