/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace createChat
 */
const { Chats, validateChats } = require('../../../models/chat')
const { Users } = require('../../../models/users')
const Logger = require('../../../services/logger')
const { createNotification } = require('../../../services/notification')

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
 * @returns 422 if users do not exist
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
    const foundUsers = []
    for (const id of req.body.participants) {
      const user = await Users.findById(id)

      if (!user || user.length === 0) {
        failedIds.push(id)
      } else {
        foundUsers.push(user)
      }
    }
    if (failedIds.length !== 0) return res.status(422).json({ message: `These users does not exist with, ids: ${failedIds}` })

    let title
    if (req.body.title) {
      title = req.body.title
    } else {
      title = foundUsers.map(user => user.firstname + ' ' + user.lastname).join(',')
    }

    const date = new Date()
    const participants = []

    req.body.participants.forEach(participant => {
      participants.push({
        user: participant,
        canSeeAfter: date
      })
    })

    const newChat = new Chats({
      facility: req.user.facility,
      date,
      createdBy: req.user._id,
      participants,
      title
    })
    await newChat.save()

    for (let index = 0; index < req.body.participants.length; index++) {
      const participant = req.body.participants[index]

      await createNotification(participant, 'Vous avez été ajouté a un chat', 'Vous avez été ajouté à un chat le ' + date.toLocaleDateString('fr-FR') + ' par ' + req.user.firstname + ' ' + req.user.lastname, 'chats', newChat._id, req.user.facility)
    }
    await createNotification(req.user._id, 'Vous avez été ajouté a un chat', 'Vous avez été ajouté à un chat le ' + date.toLocaleDateString('fr-FR') + ' par ' + req.user.firstname + ' ' + req.user.lastname, 'chats', newChat._id, req.user.facility)

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
