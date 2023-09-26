const mongoose = require('mongoose')
const dbConfig = require('./db.config')
const dbDefault = require('./db.default')

// Database Connection

async function dbConnection (databaseName) {
  // We define the host to connect to the database
  const host = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_HOST + ':' + process.env.DB_PORT
  // We try to connect to the database
  try {
    console.info('INFO: Connection to database...')
    // Set connection parameters
    mongoose.set('strictQuery', true)
    const connectionParams = dbConfig.getConfig(databaseName)

    await mongoose.connect(host, connectionParams)
    console.info('INFO: Connected to database.')

    // Init default database informations
    await dbDefault()

    return true
  } catch (error) {
    console.error('ERROR: Could not connect to Database : ', error)
    console.info('INFO: Retrying connection in 5 seconds...')
    setTimeout(() => {
      dbConnection(databaseName)
    }, 5000)
    return false
  }
}

module.exports = { dbConnection }
