const Logger = require('../../services/logger')

module.exports = (clients, participants) => {
  try {
    for (const participant of participants) {
      clients[participant]?.send(JSON.stringify({
        method: 'newChat'
      }))
    }
  } catch (e) {
    Logger.error(e)
  }
}
