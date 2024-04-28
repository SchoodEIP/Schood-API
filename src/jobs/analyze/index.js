const Logger = require('../../services/logger')
const { Facilities } = require('../../models/facilities')
const { Roles } = require('../../models/roles')
const { Users } = require('../../models/users')
const fs = require('fs')
const analyzeMessages = require('./analyzeMessages')
const analyzeQuestionnaireAnswers = require('./analyzeQuestionnaireAnswers')
const analyzeMoods = require('./analyzeMoods')
const analyzeQuestionnaireAnswerFrequency = require('./analyzeQuestionnaireAnswerFrequency')
const analyzeDailyMoodsAnswerFrequency = require('./analyzeDailyMoodsAnswerFrequency')
const analyzeMoodRate = require('./analyzeMoodRate')

let prohibitedWords

module.exports = async () => {
  Logger.info('INFO: Starting analyze')

  const facilities = await Facilities.find({})
  fs.readFile('fixtures/prohibited.txt', 'utf-8', async (err, data) => {
    if (err) {
      Logger.error('Failed to open prohibited words file:', err)
      return
    }
    prohibitedWords = data.split('\n').map(w => w.trim())
    if (!prohibitedWords) {
      Logger.error('Analyze aborted due to parsing fail.')
      return
    }
    for (const facility of facilities) {
      await analyzeFacility(facility)
    }
    Logger.info('INFO: Analyze finished')
  })
}

const analyzeFacility = async (facility) => {
  const studentRole = await Roles.findOne({ name: 'student' })
  const users = await Users.find({ role: studentRole._id, facility: facility._id })

  const analyzes = []
  for (const user of users) {
    analyzes.push(analyzeMessages(user, prohibitedWords))
    analyzes.push(analyzeQuestionnaireAnswers(user, prohibitedWords))
    analyzes.push(analyzeMoods(user, prohibitedWords))
    analyzes.push(analyzeQuestionnaireAnswerFrequency(user))
    analyzes.push(analyzeDailyMoodsAnswerFrequency(user))
    analyzes.push(analyzeMoodRate(user))
  }
  await Promise.all(analyzes)
}
