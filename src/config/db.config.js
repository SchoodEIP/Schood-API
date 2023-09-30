function getConfig (databaseName) {
  const connectionParams = {
    useNewUrlParser: true,
    socketTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
    dbName: databaseName
  }
  return connectionParams
}

exports.getConfig = getConfig
