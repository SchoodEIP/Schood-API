/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace login
 */
const { Users, validateUser } = require('../../models/users')
const csvParser = require("csv-parse")

/**
 * Main csvRegister function
 * @name POST /user/csvRegister
 * @function
 * @memberof module:router~mainRouter~userRouter~csvRegister
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 400 if invalid requests
 * @returns 401 if invalid csv format
 * @returns 200 if ok
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    console.log(req.body)
    // Verif received data
    const csv = csvParser.parse(req.body)
    console.log(csv)
    if (checkCsv(req.body.csv))
      return res.status(400).json({ message: "Invalid request" })

    if (isValid()) {
      return res.status(401).json({ message: "Csv content is not valid" })
    }

    processImport()

    // Send token
    return res.status(200).json("ok")
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

const checkCsv = (csv) => {

}

const isValid = () => {

}

const processImport = () => {

}
