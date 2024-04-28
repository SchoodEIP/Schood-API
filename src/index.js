const express = require('express')
const https = require('https')
const http = require('http')
const cors = require('cors')
const fs = require('fs')
require('dotenv').config({ path: '../.env' })
const RateLimit = require('express-rate-limit')
const { WebSocketServer } = require('ws')
const cron = require('node-cron')

const app = express()
const httpPort = process.env.HTTP_EXPRESS_PORT
const httpsPort = process.env.HTTPS_EXPRESS_PORT
const router = require('./routes/router.js')
const { dbConnection } = require('./config/db')
const sanitizer = require('./middleware/sanitize')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')
const Logger = require('./services/logger')
const webSocketHandler = require('./websockets/wsIndex')
const analyze = require('./jobs/analyze/index')

/**
 * Set limiter
 */
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20
})

const corsOptions = {
  origin: [
    'http://localhost:8080',
    'https://localhost:8080',
    'http://localhost',
    'https://localhost',
    'http://localhost:8081',
    'https://localhost:8081',
    'http://localhost:3000',
    'https://localhost:3000',
    'http://schood.fr:8080',
    'https://schood.fr:8080',
    'http://schood.fr',
    'https://schood.fr',
    'http://schood.fr:8081',
    'https://schood.fr:8081',
    'http://demo.schood.fr',
    'https://demo.schood.fr',
    'http://demo.schood.fr:8081',
    'https://demo.schood.fr:8081'
  ],
  optionsSuccessStatus: 200,
  allowedHeaders: ['Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization, Cache-Control, x-auth-token'],
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}

/**
 * Start the Node.Js server
 */
async function startServer () {
  const dbCo = await dbConnection('schood')
  if (dbCo) {
    try {
      app.use(cors(corsOptions))
      app.use(express.json())
      app.use(express.urlencoded({ extended: true }))
      if (process.env.PROD === 'true') {
        app.use(limiter)
      }
      // Init swagger
      app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
      // Init router
      app.use('/', sanitizer, router)

      // Start server
      Logger.info('INFO: START HTTP SERVER' + ' (http://localhost:' + httpPort + ')')

      const serverHttp = http.createServer(app)
      const httpWss = new WebSocketServer({ server: serverHttp })
      webSocketHandler(httpWss)
      serverHttp.listen(httpPort)

      if (process.env.HTTPS === 'true') {
        /**
         * Set keys files
         */
        const options = {
          key: fs.readFileSync('./key.pem'),
          cert: fs.readFileSync('./cert.pem'),
          ca: fs.readFileSync('./ca.pem')
        }

        Logger.info('INFO: START HTTPS SERVER' + ' (https://localhost:' + httpsPort + ')')
        const serverHttps = https.createServer(options, app)
        const httpsWss = new WebSocketServer({ server: serverHttps })
        webSocketHandler(httpsWss)
        serverHttps.listen(httpsPort)
      }
      // Cron which executes the function every day at midnight at Paris Time Zone
      cron.schedule('0 0 0 * * *', () => {
        analyze()
      }, {
        scheduled: true,
        timezone: 'Europe/Paris'
      })
      console.log('=============================================')
    } catch (error) {
      Logger.error('ERROR: index.js error : ', error)
    }
  }
}

startServer()
