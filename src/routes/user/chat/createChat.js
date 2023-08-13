/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace createChat
 */
const { Chats, validateChats } = require('../../../models/chat')
const { Users } = require('../../../models/users')

/**
 * Main login function
 * @name POST /user/chat
 * @function
 * @memberof module:router~mainRouter~userRouter~createChat
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK
 * @returns 400 if invalid requests
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    // Verif received data
    const { error } = validateChats(req.body)
    if (error) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    const failedIds = []
    for (const id of req.body.participants) {
      const user = await Users.findById(id)

      if (!user || user.length === 0) {
        failedIds.push(id)
      }
    }
    if (failedIds.length !== 0) return res.status(422).json({ message: `These users does not exist with, ids: ${failedIds}` })

    const newChat = new Chats({
      facility: req.user.facility,
      date: new Date(),
      createdBy: req.user._id,
      participants: [...req.body.participants, req.user._id]
    })
    newChat.save()

    console.log((await Chats.find()).length)

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
