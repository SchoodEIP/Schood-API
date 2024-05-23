const { Alerts } = require('../../models/alertSystem')
const { Classes } = require('../../models/classes')
const { Roles } = require('../../models/roles')
const { Users } = require('../../models/users')
const Logger = require('../../services/logger')
const { createNotificationForAllStudentOfClass, createNotificationForRole } = require('../../services/notification')

module.exports = async (facility) => {
  Logger.info('--------------------------------------------------')
  Logger.info('INFO: Checking defaultAlerts')
  const alerts = await Alerts.find({ facility: facility._id })
  const class200 = await Classes.findOne({ name: '200', facility: facility._id })
  const class201 = await Classes.findOne({ name: '201', facility: facility._id })
  const adminUser = await Users.findOne({ firstname: 'admin', facility: facility._id })
  const teacherRole = await Roles.findOne({ name: 'teacher' })
  const alertsToInit = [
    {
      title: 'Bonjour à tous !',
      message: 'Bonjour à toutes et à tous et bonne rentrée 2024 !',
      forClasses: true,
      classes: [class200._id, class201._id],
      createdBy: adminUser._id,
      facility: facility._id
    },
    {
      title: 'Bonjour aux professeurs !',
      message: 'Bonjour cher collègues et bienvenue à cette rentrée 2024 !',
      forClasses: false,
      role: teacherRole._id,
      createdBy: adminUser._id,
      facility: facility._id
    }
  ]

  for (let index = 0; index < alertsToInit.length; index++) {
    const alertToInit = alertsToInit[index]
    if (!alerts.find((alert) => String(alert.title) === alertToInit.title)) {
      Logger.info('INFO: Init default alert ' + alertToInit.title)
      const alert = new Alerts(alertToInit)
      await alert.save()

      const date = new Date()
      if (alertToInit.forClasses) {
        for (let index = 0; index < alertToInit.classes.length; index++) {
          const _class = alertToInit.classes[index]

          await createNotificationForAllStudentOfClass(_class, 'Une nouvelle alerte a été créée', 'Une nouvelles alerte a été créée le ' + date.toLocaleDateString('fr-FR') + ' par ' + adminUser.firstname + ' ' + adminUser.lastname, 'alerts', alert._id, facility._id)
        }
      } else {
        await createNotificationForRole(teacherRole.name, 'Une nouvelle alerte a été créée', 'Une nouvelles alerte a été créée le ' + date.toDateString('fr-FR') + ' par ' + adminUser.firstname + ' ' + adminUser.lastname, 'alerts', alert._id, facility._id)
      }
    }
  }
}
