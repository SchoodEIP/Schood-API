function getConfig (databaseName, test = false) {
  let connectionParams
  if (test) {
    connectionParams = {
      socketTimeoutMS: 1000,
      connectTimeoutMS: 1000,
      serverSelectionTimeoutMS: 1000,
      dbName: databaseName
    }
  } else {
    connectionParams = {
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
      dbName: databaseName
    }
  }
  return connectionParams
}

exports.getConfig = getConfig
