const { Reports, Types } = require('../../models/reports')
const { Users } = require('../../models/users')
const Logger = require('../../services/logger')
const { DailyMoods } = require('../../models/dailyMoods')
const { Moods } = require('../../models/moods')

module.exports = async (user) => {
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - fromDate.getDay() - 6)
  fromDate.setUTCHours(0, 0, 0, 0)

  const toDate = new Date()
  toDate.setDate(fromDate.getDate() + 7)
  toDate.setUTCHours(0, 0, 0, 0)
  const dailyMoods = await DailyMoods.find({ facility: user.facility, user: user._id, date: { $gte: fromDate, $lt: toDate } })
  const moods = await Moods.find({ facility: user.facility, user: user._id, date: { $gte: fromDate, $lt: toDate } })

  if (!dailyMoods) return
  let averageMood = 0
  for (const dailyMood of dailyMoods) {
    averageMood += dailyMood.mood
  }
  let notAnonymousMoods = 0
  for (const mood of moods) {
    if (mood.anonymous) continue
    averageMood += mood.mood
    notAnonymousMoods += 1
  }
  const average = averageMood / (dailyMoods.length + notAnonymousMoods) * 20
  if (average <= 60) createReport(user)
}

const createReport = async (user) => {
  const reporter = await Users.findOne({ facility: user.facility, firstname: 'analyse' })
  const checkReport = await Reports.findOne({
    facility: user.facility,
    signaledBy: reporter._id,
    userSignaled: user._id,
    message: 'This user seems to have a low mood average',
    seen: false
  })
  if (checkReport) return

  const report = new Reports({
    userSignaled: user._id,
    signaledBy: reporter._id,
    createdAt: new Date(),
    message: 'This user seems to have a low mood average',
    type: Types.OTHER,
    facility: user.facility
  })
  Logger.info('New report created.')
  await report.save()
}
