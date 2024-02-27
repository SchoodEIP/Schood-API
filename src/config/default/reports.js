const { Reports } = require('../../models/reports')
const { Users } = require('../../models/users')
const Logger = require('../../services/logger')
const { createNotificationForAllAdministrations } = require('../../services/notification')

module.exports = async (facility) => {
  Logger.info('--------------------------------------------------')
  Logger.info('INFO: Checking defaultReports')
  const reports = await Reports.find({ facility: facility._id })
  const student1User = await Users.findOne({ firstname: 'Alice', facility: facility._id })
  const student2User = await Users.findOne({ firstname: 'Jean-Pierre', facility: facility._id })
  const teacher1User = await Users.findOne({ firstname: 'Pierre', facility: facility._id })
  const teacher2User = await Users.findOne({ firstname: 'Marie', facility: facility._id })

  const reportsToInit = [
    {
      userSignaled: student1User,
      signaledBy: teacher1User,
      createdAt: new Date('2024-02-24'),
      message: 'Ceci est un signalement de test',
      type: 'other',
      facility: facility._id
    },
    {
      userSignaled: student2User,
      signaledBy: teacher2User,
      createdAt: new Date('2024-02-24'),
      message: 'Ceci est un signalement de test2',
      type: 'other',
      facility: facility._id
    }
  ]

  for (let index = 0; index < reportsToInit.length; index++) {
    const reportToInit = reportsToInit[index]
    if (!reports.find((report) => String(report.message) === String(reportToInit.message))) {
      Logger.info('INFO: Init default report ' + reportToInit.message)
      const report = new Reports(reportToInit)
      await report.save()

      const reporter = await Users.findById(reportToInit.signaledBy)
      const date = new Date(reportToInit.createdAt)

      await createNotificationForAllAdministrations('Un nouveau signalement a été créé', 'Un nouveau signalement a été créé le ' + date.toDateString() + ' par ' + reporter.firstname + ' ' + reporter.lastname, 'reports', report._id, facility._id)
    }
  }
}
