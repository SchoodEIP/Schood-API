const mongoose = require('mongoose')
const dbConfig = require('./db.config')
const dbDefault = require('./db.default')

// Database Connection

async function dbConnection (databaseName) {
  // We define the host to connect to the database
  const host = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_HOST + ':' + process.env.DB_PORT
  // We try to connect to the database
  try {
    console.log('INFO: Connection to database...')
    // Set connection parameters
    mongoose.set('strictQuery', true)
    console.log("host", host)
    const connectionParams = dbConfig.getConfig(databaseName)

    await mongoose.connect(host, connectionParams)
    console.log('INFO: Connected to database.')

    // Init default database informations
    await dbDefault()

    return true
  } catch (error) {
    console.log('ERROR: Could not connect to Database : ', error)
    return false
  }
}

module.exports = { dbConnection }
