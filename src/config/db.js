const mongoose = require('mongoose')
const dbConfig = require('./db.config')
const dbDefault = require('./db.default')
const Logger = require('../services/logger')

// Database Connection

async function dbConnection (databaseName, test = false, test2 = false) {
  // We define the host to connect to the database
  const host = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_HOST + ':' + process.env.DB_PORT
  // We try to connect to the database
  try {
    Logger.info('INFO: Connection to database...')
    // Set connection parameters
    mongoose.set('strictQuery', true)
    const connectionParams = dbConfig.getConfig(databaseName, test2)

    await mongoose.connect(host, connectionParams)
    Logger.info('INFO: Connected to database.')

    // Init default database informations
    await dbDefault(test)

    return true
  } catch (error) /* istanbul ignore next */ {
    Logger.error('ERROR: Could not connect to Database : ', error)
    Logger.info('INFO: Retrying connection in 5 seconds...')
    if (!test) /* istanbul ignore next */ {
      setTimeout(() => {
        dbConnection(databaseName)
      }, 5000)
    }
    return false
  }
}

module.exports = { dbConnection }
