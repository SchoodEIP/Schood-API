const { Facilities } = require('../models/facilities')
const Logger = require('../services/logger')

const initDefaultUsers = require('./default/users')
const initDefaultRoles = require('./default/roles')
const initDefaultClasses = require('./default/classes')
const initDefaultFacility = require('./default/facilities')
const initDefaultHelpNumbersCategories = require('./default/helpNumbersCategories')
const initDefaultHelpNumbers = require('./default/helpNumbers')
const initDefaultAlerts = require('./default/alerts')
const initDefaultQuestionnaires = require('./default/questionnaires')
const initDefaultAnswers = require('./default/answers')
const initDefaultChats = require('./default/chats')
const initDefaultDailyMoods = require('./default/dailyMoods')
const initDefaultMessages = require('./default/messages')
const initDefaultReports = require('./default/reports')
const initDefaultMoods = require('./default/moods')

module.exports = async (test = false) => {
  try {
    // if (test) Logger.displayed = false

    // Init defaultRoles
    await initDefaultRoles()

    // Check for facilities
    await initDefaultFacility()

    // Init data for each facilities
    const facilities = await Facilities.find({})
    for (let index = 0; index < facilities.length; index++) {
      const facility = facilities[index]

      if (process.env.PROD === 'false') {
        await initDefaultClasses(facility)
      }
      await initDefaultUsers(facility)
      await initDefaultHelpNumbersCategories(facility)
      await initDefaultHelpNumbers(facility)
      if (process.env.PROD === 'false') {
        await initDefaultAlerts(facility)
        await initDefaultQuestionnaires(facility)
        await initDefaultAnswers(facility)
        await initDefaultChats(facility)
        await initDefaultDailyMoods(facility)
        await initDefaultMessages(facility)
        await initDefaultReports(facility)
        await initDefaultMoods(facility)
      }
    }
    // if (test) Logger.displayed = process.env.LOGGER === 'true'
  } catch (error) {
    Logger.error('ERROR: Init default data : ', error)
  }
}
