const { Moods } = require('../../models/moods')
const { Users } = require('../../models/users')
const Logger = require('../../services/logger')

const getGoodDateFormated = (date) => {
  const dateTmp = new Date(date)
  dateTmp.setUTCHours(0, 0, 0, 0)
  return dateTmp
}

module.exports = async (facility) => {
  Logger.info('--------------------------------------------------')
  Logger.info('INFO: Checking defaultMoods')
  const moods = await Moods.find({ facility: facility._id })
  const student1User = await Users.findOne({ firstname: 'Alice', facility: facility._id })
  const student2User = await Users.findOne({ firstname: 'Jean-Pierre', facility: facility._id })

  const moodsToInit = [
    {
      user: student1User._id,
      mood: 1,
      date: getGoodDateFormated('2024-02-24'),
      comment: 'Default comment 0',
      annonymous: false,
      facility: facility._id
    },
    {
      user: student1User._id,
      mood: 2,
      date: getGoodDateFormated('2024-02-23'),
      comment: 'Default comment 1',
      annonymous: true,
      facility: facility._id
    },
    {
      user: student1User._id,
      mood: 2,
      date: getGoodDateFormated('2024-02-22'),
      comment: 'Default comment 2',
      annonymous: false,
      facility: facility._id
    },
    {
      user: student1User._id,
      mood: 3,
      date: getGoodDateFormated('2024-02-21'),
      comment: 'Default comment 3',
      annonymous: true,
      facility: facility._id
    },
    {
      user: student2User._id,
      mood: 3,
      date: getGoodDateFormated('2024-02-24'),
      comment: 'Default comment 4',
      annonymous: false,
      facility: facility._id
    },
    {
      user: student2User._id,
      mood: 2,
      date: getGoodDateFormated('2024-02-23'),
      comment: 'Default comment 5',
      annonymous: true,
      facility: facility._id
    },
    {
      user: student2User._id,
      mood: 2,
      date: getGoodDateFormated('2024-02-22'),
      comment: 'Default comment 6',
      annonymous: false,
      facility: facility._id
    },
    {
      user: student2User._id,
      mood: 1,
      date: getGoodDateFormated('2024-02-21'),
      comment: 'Default comment 7',
      annonymous: true,
      facility: facility._id
    }
  ]

  for (let index = 0; index < moodsToInit.length; index++) {
    const moodToInit = moodsToInit[index]
    if (!moods.find((mood) => String(mood.user) === String(moodToInit.user))) {
      Logger.info('INFO: Init default mood ' + moodToInit.user + ' ' + moodToInit.mood)
      const mood = new Moods(moodToInit)
      await mood.save()
    }
  }
}
