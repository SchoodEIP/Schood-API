const { HelpNumbersCategories } = require('../../models/helpNumbersCategories')
const Logger = require('../../services/logger')

module.exports = async (facility) => {
  Logger.info('--------------------------------------------------')
  Logger.info('INFO: Checking defaultHelpNumbersCategories')
  const helpNumbersCategories = await HelpNumbersCategories.find({ facility: facility._id })

  const helpNumbersCategoriesToInit = [
    {
      name: 'Autres',
      facility: facility._id,
      default: true
    },
    {
      name: "Numéros d'urgences",
      facility: facility._id,
      default: false
    },
    {
      name: "Numéros d'aide aux victimes",
      facility: facility._id,
      default: false
    },
    {
      name: 'Addictions',
      facility: facility._id,
      default: false
    }
  ]

  for (let index = 0; index < helpNumbersCategoriesToInit.length; index++) {
    const helpNumbersCategoryToInit = helpNumbersCategoriesToInit[index]
    if (!helpNumbersCategories.find((helpNumbersCategory) => String(helpNumbersCategory.name) === helpNumbersCategoryToInit.name)) {
      Logger.info('INFO: Init default helpNumbersCategory ' + helpNumbersCategoryToInit.name)
      const helpNumbersCategory = new HelpNumbersCategories(helpNumbersCategoryToInit)

      await helpNumbersCategory.save()
    }
  }
}
