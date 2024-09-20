const { Chats } = require('../../models/chat')
const { Users } = require('../../models/users')
const Logger = require('../../services/logger')
const { createNotification } = require('../../services/notification')

module.exports = async (facility) => {
  Logger.info('--------------------------------------------------')
  Logger.info('INFO: Checking defaultChats')
  const chats = await Chats.find({ facility: facility._id })
  const student1User = await Users.findOne({ firstname: 'Alice', facility: facility._id })
  const student2User = await Users.findOne({ firstname: 'Jean-Pierre', facility: facility._id })
  const teacher1User = await Users.findOne({ firstname: 'Pierre', facility: facility._id })
  const teacher2User = await Users.findOne({ firstname: 'Marie', facility: facility._id })

  const chatsToInit = [
    {
      facility: facility._id,
      participants: [ {user: student1User._id}, {user: teacher1User._id}, {user: teacher2User._id}],
      date: new Date('2024-02-24'),
      createdBy: student1User._id,
      title: 'Demande de soutien'
    },
    {
      facility: facility._id,
      participants: [{user: student2User._id}, {user: teacher2User._id}],
      date: new Date('2024-01-24'),
      createdBy: student2User._id,
      title: "Demande d'aide concernant la leçon de mathématique"
    }
  ]

  for (let index = 0; index < chatsToInit.length; index++) {
    const chatToInit = chatsToInit[index]
    if (!chats.find((chat) => String(chat.title) === String(chatToInit.title))) {
      Logger.info('INFO: Init default chat ' + chatToInit.title)
      const chat = new Chats(chatToInit)
      await chat.save()

      for (let index = 0; index < chatToInit.participants.length; index++) {
        const participant = chatToInit.participants[index].user
        const createdBy = await Users.findById(chatToInit.createdBy)
        const date = chatToInit.date

        await createNotification(participant, 'Vous avez été ajouté a un chat', 'Vous avez été ajouté à un chat le ' + date.toLocaleDateString('fr-FR') + ' par ' + createdBy.firstname + ' ' + createdBy.lastname, 'chats', chat._id, facility._id)
      }
    }
  }
}
