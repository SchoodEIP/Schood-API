/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace addParticipants
 */
const { Chats, validateChats } = require('../../../models/chat')
const { Users } = require('../../../models/users')
const mongoose = require('mongoose')
const { createNotification } = require('../../../services/notification')

/**
 * Main add participants function
 * @name POST /user/chat/:id/addParticipants
 * @function
 * @memberof module:router~mainRouter~userRouter~addParticipants
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK
 * @returns 400 if invalid requests
 * @returns 422 if users do not exist
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    // Verif received data
    const id = req.params.id
    const canSeeAfter = req.body.canSeeAfter

    if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid request' })
    const { error } = validateChats(req.body)
    if (error) return res.status(400).json({ message: 'Invalid request' })

    const chat = await Chats.findById(id)
    if (!chat || chat.length === 0) return res.status(400).json({ message: 'Invalid request' })
    if (!chat.participants.find((p) => p.user.equals(req.user._id))) return res.status(400).json({ message: 'User not in chat' })

    const failedIds = []
    const alreadyInChat = []
    for (const p of req.body.participants) {
      const user = await Users.findById(p)

      if (!user || user.length === 0) {
        failedIds.push(p)
      } else if (chat.participants.find((p2) => p2.user.equals(p))) {
        alreadyInChat.push(p)
      }
    }
    if (failedIds.length !== 0) return res.status(422).json({ message: `Users not found: ${failedIds}` })
    if (alreadyInChat.length !== 0) return res.status(422).json({ message: `These users are already in chat, ids: ${alreadyInChat}` })

    req.body.participants.forEach(participant => {
      chat.participants.push({
        user: participant,
        canSeeAfter: new Date(canSeeAfter)
      })
    })
    await chat.save()

    const date = new Date(chat.date)
    for (let index = 0; index < req.body.participants.length; index++) {
      const participant = req.body.participants[index]

      await createNotification(participant, 'Vous avez été ajouté a un chat', 'Vous avez été ajouté à un chat le ' + date.toLocaleDateString('fr-FR') + ' par ' + req.user.firstname + ' ' + req.user.lastname, 'chats', chat._id, req.user.facility)
    }

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
