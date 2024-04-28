const { Titles } = require('../../models/titles')
const Logger = require('../../services/logger')

module.exports = async (facility) => {
  Logger.info('--------------------------------------------------')
  Logger.info('INFO: Checking defaultTitles')
  const titles = await Titles.find({})
  const titlesToInit = [
    {
      name: 'Administrateur',
      facility: facility._id
    },
    {
      name: 'Administrateur Scolaire',
      facility: facility._id
    },
    {
      name: 'Mathématiques',
      facility: facility._id
    },
    {
      name: 'Français',
      facility: facility._id
    }
  ]

  for (let index = 0; index < titlesToInit.length; index++) {
    const titleToInit = titlesToInit[index]
    if (!titles.find((title) => String(title.name) === titleToInit.name && String(title.facility) === String(facility._id))) {
      Logger.info('INFO: Init default title ' + titleToInit.name)
      const title = new Titles(titleToInit)
      await title.save()
    }
  }
}
