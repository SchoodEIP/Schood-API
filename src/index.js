const express = require('express')

const app = express()
const port = process.env.EXPRESS_PORT
const router = require('./routes/router.js')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

/**
 * Start the Node.Js server
 */
async function startServer () {
  try {
    app.use(express.json())
    app.use(cors({
      credentials: true,
      origin: '*',
      allowedHeaders: '*'
    }))
    // Init swagger
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
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
