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
    usersSignaled: [user._id],
    message: 'Cet utilisateur semble avoir utilisé des vulgarité dans son rapport de ressenti.',
    seen: false
  })
  if (checkReport) return

  const report = new Reports({
    usersSignaled: [user._id],
    signaledBy: reporter._id,
    createdAt: new Date(),
    message: 'Cet utilisateur semble avoir utilisé des vulgarité dans son rapport de ressenti.',
    type: Types.BADCOMPORTMENT,
    facility: user.facility
  })
  Logger.info('New report created.')
  await report.save()
}
