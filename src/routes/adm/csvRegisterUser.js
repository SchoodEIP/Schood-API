/**
 * @memberof module:router~mainRouter~admRouter
 * @inner
 * @namespace csvRegisterUser
 */
const { Users } = require('../../models/users')
const csvParser = require("csv-parser")
const fs = require('fs')
const { Roles } = require('../../models/roles')
const bcrypt = require('bcryptjs')
const random = require('random-string-generator')
const { Classes } = require('../../models/classes')

/**
 * Main csvRegisterUser function
 * @name POST /adm/csvRegisterUser
 * @function
 * @memberof module:router~mainRouter~userRouter~csvRegisterUser
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
    // Verify received data
    if (req.file.size === 0)
      return res.status(401).json({ message: "The file is empty" })

    const csv = await convertCsv(req.file.path)
    if (!csv)
      return res.status(400).json({ message: "Invalid request" })

    if (checkCsvHeader(csv[0]))
      return res.status(401).json({ message: "Csv header is not valid" })

    const error = await checkCsvBody(csv)
    if (error.length !== 0) {
      return res.status(401).json(error)
    }

    const [err, line, row] = await processImport(csv)
    if (err) {
      console.log(line, row)
      return res.status(422).json({
        line,
        row
      })
    }

    return res.status(200).json("ok")
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

const convertCsv = async (filepath) => {
  const csv = []

  const promise = new Promise((resolve, reject) => {
    try {
      fs.createReadStream(filepath)
        .pipe(csvParser())
        .on('data', (data) => csv.push(data))
        .on('end', () => {
          resolve(csv)
        })
    } catch (e) {
      resolve(null)
    }
  })

  return await promise
}

const checkCsvHeader = (row) => {
  const keys = ["firstname", "lastname", "email", "role", "class"]

  for (const key of keys) {
    if (Object.keys(row).filter(headerName => headerName === key).length !== 1) {
      return true
    }
  }
  for (const key of Object.keys(row)) {
    if (!keys.includes(key))
      return true
  }
  return false
}

const checkCsvBody = async (csv) => {
  let error = []

  const addError = (errorType, index) => {
    const idx = error.findIndex((e) => e.rowCSV === index + 2)
    if (idx === -1)
      error.push({ rowCSV: index + 2, errors: [errorType], ...csv[index] })
    else
      error[idx].errors.push(errorType)
  }

  for (const [index, row] of csv.entries()) {
    if (row.firstname.length === 0 ||  !/^([a-zA-Z]| |-)+$/.test(row.firstname)) addError("Firstname is not valid", index)
    if (row.lastname.length === 0 || !/^([a-zA-Z]| |-)+$/.test(row.lastname)) addError("Lastname is not valid", index)
    if (row.email.length === 0 || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(row.email)) addError("Email is not valid", index)
    if (row.role.length === 0 || !["student", "teacher", "adm"].includes(row.role.toLowerCase())) addError("Role is not valid", index)
    if (row["class"].length === 0 || !/^([a-zA-Z0-9]| |-)+$/.test(row["class"])) addError("Class is not valid", index)

    if (await Users.findOne({email: row.email})) {
      addError("User already exists", index)
    }

    const class_ = Classes.findOne({ name: row["class"] })

    if (!class_ || class_.length === 0) {
      addError("Invalid class", index)
    }
  }
  return error
}

const processImport = async (csv) => {
  let line
  let row
  try {
    for (const [index, val] of csv.entries()) {
      line = index
      row = val

      const hash = await bcrypt.hash(random(10, 'alphanumeric'), 10)
      const user= new Users({
        ...val,
        firstname: val.firstname,
        lastname: val.lastname,
        email: val.email,
        classes: [Classes.findOne({ name: val['class'] })._id],
        role: await Roles.findOne({ name: val.role })._id,
        password: hash
      })
      await user.save()
    }
  } catch (e) {
    console.log(e)
    return [true, line, row]
  }
  return [false, "", -1]
}
