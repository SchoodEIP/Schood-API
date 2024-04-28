const { Reports, Types } = require('../../models/reports')
const { Users } = require('../../models/users')
const Logger = require('../../services/logger')
const { DailyMoods } = require('../../models/dailyMoods')

module.exports = async (user) => {
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - fromDate.getDay() - 6)
  fromDate.setUTCHours(0, 0, 0, 0)

  const toDate = new Date()
  toDate.setDate(fromDate.getDate() + 7)
  toDate.setUTCHours(0, 0, 0, 0)
  const dailyMoods = await DailyMoods.find({ facility: user.facility, user: user._id, date: { $gte: fromDate, $lt: toDate } })

  if (!dailyMoods) return
  const frequency = dailyMoods.length / 7 * 100
  if (frequency <= 50) createReport(user)
}

const createReport = async (user) => {
  const reporter = await Users.findOne({ facility: user.facility, firstname: 'analyse' })
  const checkReport = await Reports.findOne({
    facility: user.facility,
    signaledBy: reporter._id,
    userSignaled: user._id,
    message: 'This user has not given his/her dailyMood for enough days last week',
    seen: false
  })
  if (checkReport) return

  const report = new Reports({
    userSignaled: user._id,
    signaledBy: reporter._id,
    createdAt: new Date(),
    message: 'This user has not given his/her dailyMood for enough days last week',
    type: Types.OTHER,
    facility: user.facility
  })
  Logger.info('New report created.')
  await report.save()
}
