const express = require('express')
const cors = require('cors')
require('dotenv').config({ path: '../.env' })

const app = express()
const port = process.env.EXPRESS_PORT
const router = require('./routes/router.js')
const { dbConnection } = require('./config/db')
const sanitizer = require('./middleware/sanitize')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

/**
 * Start the Node.Js server
 */
async function startServer () {
  const dbCo = await dbConnection('schood')
  if (dbCo) {
    try {
      app.use(express.json())
      app.use(express.urlencoded({extended: true}))
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
      app.listen(port, () => {
        console.log(`INFO: API listening at http://localhost:${port}`)
      })
    } catch (error) {
      console.error('ERROR: index.js error : ', error)
    }
  }
}

startServer()
