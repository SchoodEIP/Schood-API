/**
 * @memberof module:router~mainRouter~reportsRouter
 * @inner
 * @namespace reports
 */

const { default: mongoose } = require('mongoose')
const { Reports, validateModify } = require('../../../models/reports')
const { Users } = require('../../../models/users')
const { Chats } = require('../../../models/chat')

/**
 * Main reports function
 * @name PATCH /shared/reports
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
    const id = req.params.id
    const { error } = validateModify(req.body)
    if (error) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    if (req.body.userSignaled) {
      const user = await Users.findById(req.body.userSignaled)
      if (!user) {
        return res.status(400).json({ message: 'Invalid request' })
      }
    }

    if (req.body.conversation) {
      const conversation = await Chats.findById(req.body.conversation)
      if (!conversation) {
        return res.status(400).json({ message: 'Invalid request' })
      }
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid request' })
    }
    const report = await Reports.findById(id)
    if (!report) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    if (req.user.role.levelOfAccess === 0) {
      if (String(report.signaledBy) !== String(req.usre._id)) {
        return res.status(400).json({ message: 'Invalid request' })
      }
    }

    report.userSignaled = req.body.userSignaled ? new mongoose.Types.ObjectId(req.body.userSignaled) : report.userSignaled
    report.modifiedAt = new Date()
    report.modifiedBy = req.user._id
    report.message = req.body.message ? req.body.message : report.message
    report.conversation = req.body.conversation ? new mongoose.Types.ObjectId(req.body.conversation) : report.conversation
    report.type = req.body.type ? req.body.type : report.type

    await report.save()

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
