/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace deleteMessage
 */

const { Messages } = require('../../../models/message')
const mongoose = require('mongoose')
const { Chats } = require('../../../models/chat')

/**
 * Main delete message function
 * @name DELETE /user/chat/:id/messages
 * @function
 * @memberof module:router~mainRouter~userRouter~deleteMessage
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK
 * @returns 400 if invalid requests
 * @returns 401 if user did not send the message
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    // Verif received id
    const id = req.params.id
    const messageId = req.params.messageId

    if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid request' })
    if (!messageId || !mongoose.Types.ObjectId.isValid(messageId)) return res.status(400).json({ message: 'Invalid request' })

    const message = await Messages.findById(messageId)
    if (!message || message.length === 0) return res.status(400).json({ message: 'Invalid request' })
    if (!req.user._id.equals(message.user)) return res.status(401).json({ message: 'Not allowed' })

    const chat = await Chats.findById(id)
    if (!chat || chat.length === 0) return res.status(400).json({ message: 'Invalid request' })

    for (let i = 0; i < chat.messages.length; ++i) {
      if (String(chat.messages[i]) === String(message._id)) {
        chat.messages.splice(i, 1)
        break
      }
    }

    await chat.save()
    await Messages.findByIdAndDelete(messageId)
    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
