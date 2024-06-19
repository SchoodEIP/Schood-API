/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace chat/getMessages
 */
const { default: mongoose } = require('mongoose')
const { Chats } = require('../../../models/chat')
const { Messages } = require('../../../models/message')
const Logger = require('../../../services/logger')
const { Users } = require('../../../models/users')

/**
 * Main login function
 * @name GET /user/chat/:id
 * @function
 * @memberof module:router~mainRouter~userRouter~getChats
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK and send JSON containing an array of messages
 * @returns 400 if wrong chat id
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const id = req.params.id
    if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid request' })

    const chat = await Chats.findById(id)
    if (!chat || chat.length === 0) return res.status(400).json({ message: 'Invalid request' })
    const user = await Users.findById(req.user._id)
    if (!user) return res.status(400).json({ message: 'Invalid request' })
    const chatUser = chat.participants.find((p) => String(p.user) === String(req.user._id))
    
    const messages = []
    for (const messageId of chat.messages) {
      const message = await Messages.findById(messageId)
      if ((new Date(message.date)).getTime() > (new Date(chatUser.canSeeAfter)).getTime()) {
        messages.push(message)
      }
    }
    return res.status(200).json(messages)
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
