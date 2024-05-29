/**
 * @memberof module:router~mainRouter~sharedRouter~alertSystemRouter
 * @inner
 * @namespace registerAlert
 */

const { validateAlerts, Alerts } = require('../../../models/alertSystem')
const { Classes } = require('../../../models/classes')
const mongoose = require('mongoose')
const { Roles } = require('../../../models/roles')
const { createNotificationForAllStudentOfClass, createNotificationForRole } = require('../../../services/notification')

/**
 * Main register alert function
 * @name POST /shared/alert/
 * @function
 * @memberof module:router~mainRouter~sharedRouter~alertSystemRouter~registerAlert
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK and return alert data
 * @returns 400 if Invalid arguments
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    // Verif received data
    const { error } = validateAlerts(req.body)
    if (error) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    let forClasses = false
    if (req.body.classes) {
      if (!Array.isArray(req.body.classes)) {
        return res.status(400).json({ message: 'Invalid request' })
      }
      if (req.body.classes.length > 0) {
        for (let index = 0; index < req.body.classes.length; index++) {
          const _class = req.body.classes[index]
          if (!mongoose.Types.ObjectId.isValid(_class)) {
            return res.status(400).json({ message: 'Invalid request' })
          }
          const classData = await Classes.findById(_class)

          if (!classData) {
            return res.status(400).json({ message: 'Invalid request' })
          }
        }
        forClasses = true
      }
    }
    if (req.body.role) {
      if (forClasses) {
        return res.status(400).json({ message: 'Invalid request' })
      }
      const role = req.body.role
      if (!mongoose.Types.ObjectId.isValid(role)) {
        return res.status(400).json({ message: 'Invalid request' })
      }

      const roleData = await Roles.findById(role)
      if (!roleData) {
        return res.status(400).json({ message: 'Invalid request' })
      }
    } else {
      if (!forClasses) {
        return res.status(400).json({ message: 'Invalid request' })
      }
    }

    const date = new Date()
    const alert = new Alerts({
      title: req.body.title,
      message: req.body.message,
      file: null,
      forClasses,
      classes: req.body.classes ? req.body.classes : null,
      role: req.body.role ? req.body.role : null,
      createdAt: date,
      createdBy: req.user._id,
      facility: req.user.facility
    })

    await alert.save()

    if (forClasses) {
      for (let index = 0; index < req.body.classes.length; index++) {
        const _class = req.body.classes[index]

        await createNotificationForAllStudentOfClass(_class, 'Une nouvelle alerte a été créée', 'Une nouvelles alerte a été créée le ' + date.toLocaleDateString('fr-FR') + ' par ' + req.user.firstname + ' ' + req.user.lastname, 'alerts', alert._id, req.user.facility)
      }
    } else {
      const role = await Roles.findById(req.body.role)

      await createNotificationForRole(role.name, 'Une nouvelle alerte a été créée', 'Une nouvelles alerte a été créée le ' + date.toLocaleDateString('fr-FR') + ' par ' + req.user.firstname + ' ' + req.user.lastname, 'alerts', alert._id, req.user.facility)
    }

    return res.status(200).json(alert)
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
