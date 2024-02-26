/**
 * @memberof module:router~mainRouter~admRouter
 * @inner
 * @namespace delete
 */

const { Users, validateDelete } = require('../../../models/users')
const mongoose = require('mongoose')
const Logger = require('../../../services/logger')
const { Alerts } = require('../../../models/alertSystem')
const { Answers } = require('../../../models/answers')
const { Chats, removeUserFromChat } = require('../../../models/chat')
const { DailyMoods } = require('../../../models/dailyMoods')
const { Notifications } = require('../../../models/notifications')
const { Questionnaires } = require('../../../models/questionnaire')
const { Reports } = require('../../../models/reports')

/**
 * Main register function
 * @name POST /adm/register
 * @function
 * @memberof module:router~mainRouter~admRouter~register
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 400 if invalid requests
 * @returns 200 if OK
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const id = req.params.id

    if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid request' })

    const { error } = validateDelete(req.body)
    if (error) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    const userToDelete = await Users.findById(id)
    if (!userToDelete || userToDelete.length === 0) {
      return res.status(422).json({ message: 'User not found' })
    }

    await removeUserFromCollections(userToDelete)

    const isToBeDeleted = req.body.deletePermanently
    if (!isToBeDeleted) {
      userToDelete.classes = []
      userToDelete.active = false
      await userToDelete.save()
    } else {
      await Users.findByIdAndDelete(id)
    }

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

const removeUserFromCollections = async (user) => {
  const promises = [
    Alerts.deleteMany({ createdBy: user._id }),
    Answers.deleteMany({ createdBy: user._id }),
    DailyMoods.deleteMany({ user: user._id }),
    Notifications.deleteMany({ user: user._id }),
    Questionnaires.deleteMany({ createdBy: user._id }),
    Reports.deleteMany({ userSignaled: user._id }),
    Reports.deleteMany({ signaledBy: user._id })
  ]

  const chats = await Chats.aggregate([{ $match: { participants: user._id, facility: user.facility } }])
  for (const chat of chats) {
    promises.push(removeUserFromChat(chat, user))
  }
  await Promise.all(promises)
}
