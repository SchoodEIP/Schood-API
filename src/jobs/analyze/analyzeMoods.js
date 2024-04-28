const { Reports, Types } = require('../../models/reports')
const { Users } = require('../../models/users')
const Logger = require('../../services/logger')
const { Moods } = require('../../models/moods')

module.exports = async (user, prohibitedWords) => {
  const currentDate = new Date()
  const moods = await Moods.find({ facility: user.facility, user: user._id, date: { $gte: currentDate.setDate(currentDate.getDate() - 1) } })

  if (!moods) return
  for (const mood of moods) {
    if (analyzeComment(prohibitedWords, mood.comment)) createReport(user)
  }
}

const analyzeComment = (prohibitedWords, comment) => {
  return comment.split(' ').some(word => prohibitedWords.includes(word.toLowerCase()))
}

const createReport = async (user) => {
  const reporter = await Users.findOne({ faciltiy: user.facility, firstname: 'analyse' })
  const checkReport = await Reports.findOne({
    facility: user.facility,
    signaledBy: reporter._id,
    userSignaled: user._id,
    message: 'This user seems to have sent some bad words in his/her mood report',
    seen: false
  })
  if (checkReport) return

  const report = new Reports({
    userSignaled: user._id,
    signaledBy: reporter._id,
    createdAt: new Date(),
    message: 'This user seems to have sent some bad words in his/her mood report',
    type: Types.BADCOMPORTMENT,
    facility: user.facility
  })
  Logger.info('New report created.')
  await report.save()
}
