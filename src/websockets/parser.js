const Logger = require('../services/logger')
const createChat = require('./chat/createChat')
const messageChat = require('./chat/messageChat')

module.exports = async (request, clients) => {
  switch (request.method) {
    case 'message':
      console.log('message', request.data.message)
      break
    case 'clients':
      console.log(clients)
      break
    case 'createChat':
      createChat(clients, request.data.ids)
      break
    case 'messageChat':
      await messageChat(clients, request.data.id, request.data.userId)
      break
    default:
      Logger.error(request.method + ' doesn\'t exist')
      break
  }
}
