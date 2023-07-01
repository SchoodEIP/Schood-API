const express = require('express')
const cors = require('cors')
const https = require('https')
const http = require('http')
const fs = require('fs')
require('dotenv').config({ path: '../.env' })
const RateLimit = require('express-rate-limit')

const app = express()
const httpPort = process.env.HTTP_EXPRESS_PORT
const httpsPort = process.env.HTTPS_EXPRESS_PORT
const router = require('./routes/router.js')
const { dbConnection } = require('./config/db')
const sanitizer = require('./middleware/sanitize')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

/**
 * Set limiter
 */
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20
})

/**
 * Start the Node.Js server
 */
async function startServer () {
  const dbCo = await dbConnection('schood')
  if (dbCo) {
    try {
      app.use(express.json())
      app.use(express.urlencoded({ extended: true }))
      if (process.env.PROD === 'false') {
        app.use(limiter)
      }
      app.use(cors({
        credentials: true,
        origin: '*',
        allowedHeaders: '*'
      }))
      // Init swagger
      app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
      // Init router
      app.use('/', sanitizer, router)

      // Start server
      console.log('INFO: START HTTP SERVER')
      http.createServer(app).listen(httpPort)

      if (process.env.HTTPS === 'true') {
        /**
         * Set keys files
         */
        const options = {
          key: fs.readFileSync('./key.pem'),
          cert: fs.readFileSync('./cert.pem'),
          ca: fs.readFileSync('./ca.pem')
        }

        console.log('INFO: START HTTPS SERVER')
        https.createServer(options, app).listen(httpsPort)
      }
    } catch (error) {
      console.error('ERROR: index.js error : ', error)
    }
  }
}

startServer()
