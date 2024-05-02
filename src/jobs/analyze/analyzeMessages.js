const { Messages } = require('../../models/message')
const { Reports, Types } = require('../../models/reports')
const { Users } = require('../../models/users')
const Logger = require('../../services/logger')

module.exports = async (user, prohibitedWords) => {
  const currentDate = new Date()
  const messages = await Messages.find({ facility: user.facility, user: user._id, date: { $gte: currentDate.setDate(currentDate.getDate() - 1) } })

  if (!messages) return
  for (const message of messages) {
    if (analyzeMessage(prohibitedWords, message.content)) createReport(user, message)
  }
}

const analyzeMessage = (prohibitedWords, message) => {
  return message.split(' ').some(word => prohibitedWords.includes(word.toLowerCase()))
}

const createReport = async (user, message) => {
  const reporter = await Users.findOne({ faciltiy: user.facility, firstname: 'analyse' })
  const checkReport = await Reports.findOne({
    facility: user.facility,
    signaledBy: reporter._id,
    userSignaled: user._id,
    message: 'Cet utilisateur semble avoir utilisé des vulgarités dans ses messages à une autre personne.',
    seen: false
  })
  if (checkReport) return

  const report = new Reports({
    userSignaled: user._id,
    signaledBy: reporter._id,
    createdAt: new Date(),
    message: 'Cet utilisateur semble avoir utilisé des vulgarités dans ses messages à une autre personne.',
    conversation: message.chat,
    type: Types.BADCOMPORTMENT,
    facility: user.facility
  })
  Logger.info('New report created.')
  await report.save()
}
