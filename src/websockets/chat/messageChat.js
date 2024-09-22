const Logger = require('../../services/logger')
const { Chats } = require('../../models/chat')
const mongoose = require('mongoose')

module.exports = async (clients, chatId, messageSender) => {
  try {
    if (!chatId && !mongoose.Types.ObjectId.isValid(chatId)) {
      return
    }

    const chat = await Chats.findById(chatId)
    for (const participant of chat.participants) {
      if (participant.user.equals(messageSender)) continue

      clients[participant.user]?.send(JSON.stringify({
        method: 'messageChat',
        data: chatId
      }))
    }
  } catch (e) {
    Logger.error(e)
  }
}
