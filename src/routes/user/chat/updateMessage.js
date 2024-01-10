/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace updateMessage
 */
const { Messages, validateMessages } = require('../../../models/message')
const mongoose = require('mongoose')

/**
 * Main update message function
 * @name PATCH /user/chat/messages/:messageId
 * @function
 * @memberof module:router~mainRouter~userRouter~updateMessage
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK
 * @returns 400 if invalid requests
 * @returns 422 if user does not participate in this chat
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    // Verif received id
    const id = req.params.id

    if (!id && !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid request' })

    const message = await Messages.findOne({ _id: id, facility: req.user.facility })
    if (!message || message.length === 0) return res.status(400).json({ message: 'Not found' })
    if (!req.user._id.equals(message.user)) return res.status(401).json({ message: 'Not allowed' })

    // Verif received data
    const { error } = validateMessages(req.body)
    if (error) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    message.date = new Date()
    message.content = req.body.content

    await message.save()

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
