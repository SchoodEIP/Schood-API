function getConfig (databaseName) {
  const connectionParams = {
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    serverSelectionTimeoutMS: 30000,
    dbName: databaseName
  }
  return connectionParams
}

exports.getConfig = getConfig
