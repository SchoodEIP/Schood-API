/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace newMessage
 */

const { Chats } = require('../../../models/chat')
const { Messages, validateMessages } = require('../../../models/message')
const Logger = require('../../../services/logger')

/**
 * Main new message function
 * @name POST /user/chat/:id/newMessage
 * @function
 * @memberof module:router~mainRouter~userRouter~newMessage
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
    const chat = await Chats.findById(id)
    if (!chat || chat.length === 0) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    // Verif received data
    const { error } = validateMessages(req.body)
    if (error) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    if (!chat.participants.find((user) => user.user.equals(req.user._id))) {
      return res.status(422).json({ message: 'User does not participate in this chat' })
    }

    const newMessage = new Messages({
      date: new Date(),
      user: req.user._id,
      content: req.body.content,
      chat: chat._id,
      facility: req.user.facility
    })
    await newMessage.save()
    chat.messages.push(newMessage._id)
    await chat.save()

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
