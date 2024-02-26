/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace leaveChat
 */
const { Chats, removeUserFromChat } = require('../../../models/chat')
const mongoose = require('mongoose')

/**
 * Main leave chat function
 * @name POST /user/chat/:id/leave
 * @function
 * @memberof module:router~mainRouter~userRouter~leaveChat
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK
 * @returns 400 if invalid requests
 * @returns 422 if users not in chat
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    // Verif received data
    const id = req.params.id

    if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid request' })

    const chat = await Chats.findById(id)
    if (!chat || chat.lenght === 0) return res.status(400).json({ message: 'Invalid request' })

    return await removeUserFromChat(chat, req.user, res)
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
