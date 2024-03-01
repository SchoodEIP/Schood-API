/**
 * @memberof module:router~mainRouter~admRouter~helpNumbersRouter
 * @inner
 * @namespace delete
 */

const mongoose = require('mongoose')
const { Facilities, validateDelete } = require('../../../models/facilities')
const Logger = require('../../../services/logger')
const { Alerts } = require('../../../models/alertSystem')
const { Answers } = require('../../../models/answers')
const { Chats } = require('../../../models/chat')
const { Classes } = require('../../../models/classes')
const { DailyMoods } = require('../../../models/dailyMoods')
const { Files } = require('../../../models/file')
const { HelpNumbers } = require('../../../models/helpNumbers')
const { HelpNumbersCategories } = require('../../../models/helpNumbersCategories')
const { Messages } = require('../../../models/message')
const { Notifications } = require('../../../models/notifications')
const { Questionnaires } = require('../../../models/questionnaire')
const { Reports } = require('../../../models/reports')
const { Users } = require('../../../models/users')

/**
 * Main delete function
 * @name DELETE /adm/helpNumber/:id
 * @function
 * @memberof module:router~mainRouter~admRouter~helpNumbersRouter~delete
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 400 if invalid requests
 * @returns 422 if name passed as parameter is already used
 * @returns 422 if there is no email and no telephone
 * @returns 200 if OK
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const id = req.params.id
    if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid request' })

    const { error } = validateDelete(req.body)
    if (error) return res.status(400).json({ message: 'Invalid request' })

    const facilityToDelete = await Facilities.findById(id)
    if (!facilityToDelete || facilityToDelete.length === 0) return res.status(422).json({ message: 'Facility not found' })

    if (!req.body.deletePermanently) {
      facilityToDelete.active = false
      await facilityToDelete.save()

      return res.status(200).send()
    }

    await deleteAllDocumentsFromFacility(id)
    await Facilities.findByIdAndDelete(id)

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

const deleteAllDocumentsFromFacility = async (facility) => {
  await Promise.all([
    Alerts.deleteMany({ facility }),
    Answers.deleteMany({ facility }),
    Chats.deleteMany({ facility }),
    Classes.deleteMany({ facility }),
    DailyMoods.deleteMany({ facility }),
    Files.deleteMany({ facility }),
    HelpNumbers.deleteMany({ facility }),
    HelpNumbersCategories.deleteMany({ facility }),
    Messages.deleteMany({ facility }),
    Notifications.deleteMany({ facility }),
    Questionnaires.deleteMany({ facility }),
    Reports.deleteMany({ facility }),
    Users.deleteMany({ facility })
  ])
}
