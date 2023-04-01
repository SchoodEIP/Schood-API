const express = require('express')

const app = express()
const port = process.env.EXPRESS_PORT
const router = require('./routes/router.js')

/**
 * Start the Node.Js server
 */
async function startServer () {
  try {
    // Init router
    app.use('/', router)

    // Start server
    app.listen(port, () => {
      console.log(`INFO: API listening at http://localhost:${port}`)
    })
  } catch (error) {
    console.error('ERROR: index.js error : ', error)
  }
}

startServer()
