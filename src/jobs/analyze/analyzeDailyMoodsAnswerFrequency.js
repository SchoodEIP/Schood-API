const { Reports, Types } = require('../../models/reports')
const { Users } = require('../../models/users')
const Logger = require('../../services/logger')
const { DailyMoods } = require('../../models/dailyMoods')
const { Facilities } = require('../../models/facilities')
const { Roles } = require('../../models/roles')

module.exports = async () => {
  const facilities = await Facilities.find({})
  const studentRole = await Roles.findOne({ name: 'student' })
  const promises = []

  for (const facility of facilities) {
    const users = await Users.find({ role: studentRole._id, facility: facility._id });
    if (!users) continue

    for (const user of users) {
      if (user.createdAt > Date.now() - (1000 * 60 * 60 * 24 * 7)) continue
      promises.push(analyzeFrequency(user))
    }
  }
  await Promise.all(promises)
}

const analyzeFrequency = async (user) => {
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
    message: 'Cet utilisateur n\'a pas envoyé suffisamment de ressentis quotidiens durant la dernière semaine.',
    seen: false
  })
  if (checkReport) return

  const report = new Reports({
    userSignaled: user._id,
    signaledBy: reporter._id,
    createdAt: new Date(),
    message: 'Cet utilisateur n\'a pas envoyé suffisamment de ressentis quotidiens durant la dernière semaine.',
    type: Types.OTHER,
    facility: user.facility
  })
  Logger.info('New report created.')
  await report.save()
}
