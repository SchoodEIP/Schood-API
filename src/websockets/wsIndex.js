module.exports = (wss) => {
  wss.on('connection', (ws) => {
    ws.on('error', console.error)

    ws.on('message', (data) => {
      console.log('received: %s', data)
    })

    ws.send(JSON.stringify({
      message: 'connected'
    }))
  })
}
