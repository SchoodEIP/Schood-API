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
      if (participant.equals(messageSender)) continue

      clients[participant]?.send(JSON.stringify({
        method: 'messageChat',
        data: chatId
      }))
    }
  } catch (e) {
    Logger.error(e)
  }
}
