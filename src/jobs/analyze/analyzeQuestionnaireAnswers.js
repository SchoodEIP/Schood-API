const { Reports, Types } = require('../../models/reports')
const { Users } = require('../../models/users')
const { Answers } = require('../../models/answers')
const Logger = require('../../services/logger')

module.exports = async (user, prohibitedWords) => {
  const currentDate = new Date()
  const answers = await Answers.find({ facility: user.facility, createdBy: user._id, date: { $gte: currentDate.setDate(currentDate.getDate() - 1) } })

  if (!answers) return
  for (const answer of answers) {
    if (analyzeAnswer(prohibitedWords, answer.answers)) createReport(user)
  }
}

const analyzeAnswer = (prohibitedWords, answer) => {
  for (const question of answer) {
    for (const questionAnswer of question.answers) {
      if (questionAnswer.split(' ').some(word => prohibitedWords.includes(word.toLowerCase()))) return true
    }
  }
  return false
}

const createReport = async (user) => {
  const reporter = await Users.findOne({ facility: user.facility, firstname: 'analyse' })
  const checkReport = await Reports.findOne({
    facility: user.facility,
    signaledBy: reporter._id,
    userSignaled: user._id,
    message: 'This user seems to have wrote some bad words in his/her questionnaire answer',
    seen: false
  })
  if (checkReport) return

  const report = new Reports({
    userSignaled: user._id,
    signaledBy: reporter._id,
    createdAt: new Date(),
    message: 'This user seems to have wrote some bad words in his/her questionnaire answer',
    type: Types.BADCOMPORTMENT,
    facility: user.facility
  })
  Logger.info('New report created.')
  await report.save()
}
