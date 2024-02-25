const { DailyMoods } = require('../../models/dailyMoods')
const { Users } = require('../../models/users')
const Logger = require('../../services/logger')

const getGoodDateFormated = (date) => {
  const dateTmp = new Date(date)
  dateTmp.setUTCHours(0, 0, 0, 0)
  return dateTmp
}

module.exports = async (facility) => {
  Logger.info('--------------------------------------------------')
  Logger.info('INFO: Checking defaultDailyMoods')
  const dailyMoods = await DailyMoods.find({ facility: facility._id })
  const student1User = await Users.findOne({ firstname: 'Alice', facility: facility._id })
  const student2User = await Users.findOne({ firstname: 'Jean-Pierre', facility: facility._id })

  const dailyMoodsToInit = [
    {
      user: student1User._id,
      mood: 1,
      date: getGoodDateFormated('2024-02-24'),
      facility: facility._id
    },
    {
      user: student1User._id,
      mood: 2,
      date: getGoodDateFormated('2024-02-23'),
      facility: facility._id
    },
    {
      user: student1User._id,
      mood: 2,
      date: getGoodDateFormated('2024-02-22'),
      facility: facility._id
    },
    {
      user: student1User._id,
      mood: 3,
      date: getGoodDateFormated('2024-02-21'),
      facility: facility._id
    },
    {
      user: student2User._id,
      mood: 3,
      date: getGoodDateFormated('2024-02-24'),
      facility: facility._id
    },
    {
      user: student2User._id,
      mood: 2,
      date: getGoodDateFormated('2024-02-23'),
      facility: facility._id
    },
    {
      user: student2User._id,
      mood: 2,
      date: getGoodDateFormated('2024-02-22'),
      facility: facility._id
    },
    {
      user: student2User._id,
      mood: 1,
      date: getGoodDateFormated('2024-02-21'),
      facility: facility._id
    }
  ]

  for (let index = 0; index < dailyMoodsToInit.length; index++) {
    const dailyMoodToInit = dailyMoodsToInit[index]
    if (!dailyMoods.find((dailyMood) => String(dailyMood.user) === String(dailyMoodToInit.user))) {
      Logger.info('INFO: Init default dailyMood ' + dailyMoodToInit.user + ' ' + dailyMoodToInit.mood)
      const dailyMood = new DailyMoods(dailyMoodToInit)
      await dailyMood.save()
    }
  }
}
