const { Classes } = require('../../models/classes')
const Logger = require('../../services/logger')

module.exports = async (facility) => {
  Logger.info('--------------------------------------------------')
  Logger.info('INFO: Checking defaultClasses')
  const classes = await Classes.find({ facility: facility._id })
  const classesToInit = ['200', '201', '202', '203', '204']

  for (let index = 0; index < classesToInit.length; index++) {
    const classToInit = classesToInit[index]
    if (!classes.find((class_) => String(class_.name) === classToInit)) {
      Logger.info('INFO: Init default class ' + classToInit)
      const class_ = new Classes({
        name: classToInit,
        facility: facility._id
      })
      await class_.save()
    }
  }
}
