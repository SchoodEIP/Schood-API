const parser = require('./parser')

module.exports = (wss) => {
  const clients = {}

  wss.on('connection', (ws) => {
    ws.isAlive = true
    ws.on('error', console.error)

    ws.on('message', (data) => {
      const parsedData = JSON.parse(data)

      if (parsedData.method === 'login') {
        addClient(parsedData.data.userId)
      } else if (parsedData.data.method === 'close') {
        removeClient(ws)
      } else {
        parser(parsedData, clients)
      }
    })

    ws.send(JSON.stringify({
      data: {
        message: 'connected'
      }
    }))

    ws.on('close', () => {
      removeClient()
    })

    ws.on('pong', () => {
      ws.isAlive = true
    })

    const addClient = (userId) => {
      clients[userId] = ws
    }

    const removeClient = () => {
      for (const client in clients) {
        if (clients[client] === ws) {
          delete clients[client]
        }
      }
    }
  })

  setInterval(() => {
    Object.keys(clients).forEach((client) => {
      if (clients[client].isAlive === false) {
        clients[client].terminate()
        delete clients[client]
      } else {
        clients[client].isAlive = false
        clients[client].ping()
      }
    })
  }, 5000)
}
