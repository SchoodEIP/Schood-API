/**
 * @memberof module:router~mainRouter~admRouter
 * @inner
 * @namespace csvRegisterUser
 */
const { Users } = require('../../models/users')
const csvParser = require('csv-parser')
const fs = require('fs')
const { Roles } = require('../../models/roles')
const bcrypt = require('bcryptjs')
const random = require('random-string-generator')
const { Classes } = require('../../models/classes')
const { sendMail } = require('../../services/mailer')

/**
 * Main csvRegisterUser function
 * @name POST /adm/csvRegisterUser
 * @function
 * @memberof module:router~mainRouter~admRouter~csvRegisterUser
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if ok
 * @returns 422 if invalid csv
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const mail = Boolean((req.query.mail || '').replace(/\s*(false|null|undefined|0)\s*/i, ''))
    // Verify received data
    if (req.file.size === 0) { return res.status(422).json({ message: 'The file is empty' }) }

    const csv = await convertCsv(req.file.path)
    if (!csv || csv.length === 0) { return res.status(422).json({ message: 'Invalid request' }) }

    if (checkCsvHeader(csv[0])) {
      return res.status(422).json({
        message: 'Csv header is not valid, headers have to be: ' + ['firstname', 'lastname', 'email', 'role', 'classes'].toString()
      })
    }

    const error = await checkCsvBody(csv)
    if (error.length !== 0) {
      return res.status(422).json(error)
    }

    const [err, line, row] = await processImport(csv, mail)
    if (err) {
      return res.status(422).json({
        line,
        row
      })
    }

    return res.status(200).json('ok')
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

/**
 * Convert the csv file past as parameter to an array of objects
 * @param {String} filepath
 * @returns {Promise<Object>} Returns the csv as an array of Objects, on error returns null
 */
const convertCsv = async (filepath) => {
  const csv = []

  return new Promise((resolve, reject) => {
    try {
      fs.createReadStream(filepath)
        .pipe(csvParser())
        .on('data', (data) => csv.push(data))
        .on('end', () => {
          const toResolve = csv?.map(row => { return { ...row, classes: row?.classes?.split(':') } })
          resolve(toResolve)
        })
    } catch (e) /* istanbul ignore next */ {
      resolve(null)
    }
  })
}

/**
 * Check if the names of the columns in the csv file are correct
 * @param {Object} row
 * @returns {boolean} Returns True if there is an error, False otherwise
 */
const checkCsvHeader = (row) => {
  const keys = ['firstname', 'lastname', 'email', 'role', 'classes']

  // Checks if there is any additional wrong header
  for (const key of Object.keys(row)) {
    let newKey = key
    for (let i = 0; i < newKey.length; ++i) {
      const c = newKey[i]
      if (!(c >= 'A' && c <= 'Z') && !(c >= 'a' && c <= 'z')) {
        console.log(newKey)
        if (i === 0) newKey = newKey.substring(1)
        else newKey = newKey.substring(0, i) + newKey.substring(i + 1)
        console.log(newKey)
        i--
      }
    }
    if (newKey !== key) {
      row[newKey] = row[key]
      console.log(row, newKey)
      delete row[key]
      console.log(row)
    }
    if (!keys.includes(newKey)) { console.log(`"${newKey}"`, key); return true }
  }

  // Checks if all needed keys exist
  for (const key of keys) {
    if (row[key] === undefined) { console.log(key, row, row[key]); return true }
  }
  return false
}

/**
 * Check if the values of the columns are correct
 * @param {Array<Object>} csv
 * @returns {Promise<Array>} Returns an empty array if there is no errors, otherwise returns an array filled with objects containing row of error, type of error and which User the error is coming from
 */
const checkCsvBody = async (csv) => {
  const error = []

  /**
   * Add an error to the error array
   * @param errorType
   * @param index
   */
  const addError = (errorType, index) => {
    const idx = error.findIndex((e) => e.rowCSV === index + 2)
    if (idx === -1) {
      const itemError = { ...csv[index], classes: csv[index].classes.join(':') }
      error.push({ rowCSV: index + 2, errors: [errorType], itemError })
    } else { error[idx].errors.push(errorType) }
  }

  const emails = []
  for (const [index, row] of csv.entries()) {
    if (row.firstname.length === 0 || !/^([a-zA-Z]| |-)+$/.test(row.firstname)) addError('Firstname is not valid', index)
    if (row.lastname.length === 0 || !/^([a-zA-Z]| |-)+$/.test(row.lastname)) addError('Lastname is not valid', index)
    if (row.email.length === 0 || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(row.email)) addError('Email is not valid', index)
    if (row.role.length === 0 || !['student', 'teacher', 'adm'].includes(row.role.toLowerCase())) addError('Role is not valid', index)
    console.log(await Classes.find())
    if (row.classes.length === 0) {
      addError('Class is not valid, no class set', index)
    }
    row.classes.forEach((className) => {
      if (className === 0 || !/^([a-zA-Z0-9]| |-)+$/.test(className)) { addError('Class is not valid', index) }
    })
    if (row.role === 'student' && row.classes.length > 1) addError('Student can only have one class', index)

    if (await Users.findOne({ email: row.email })) {
      addError('User already exists', index)
    }

    if (emails.includes(row.email)) {
      addError('A different user in the csv already have this email', index)
    } else {
      emails.push(row.email)
    }

    for (const class_ of row.classes) {
      const foundClass = await Classes.findOne({ name: class_ })
      if (!foundClass) {
        addError(`${class_} class does not exist`, index)
      }
    }
  }
  return error
}

/**
 * Import users from csv
 * @param csv
 * @param mail
 * @returns {Promise<(boolean|string|number)[]|(boolean|*)[]>}
 */
const processImport = async (csv, mail) => {
  let line
  let row
  try {
    for (const [index, val] of csv.entries()) {
      line = index
      row = val

      const password = random(10, 'alphanumeric')
      const classes_ = []
      for (const class_ of val.classes) {
        const foundClassId = await Classes.findOne({ name: class_ })._id

        if (!classes_.includes(foundClassId)) classes_.push(foundClassId)
      }
      const user = new Users({
        ...val,
        firstname: val.firstname,
        lastname: val.lastname,
        email: val.email,
        classes: classes_,
        role: await Roles.findOne({ name: val.role })._id,
        password: await bcrypt.hash(password, 10)
      })
      await user.save()

      /* istanbul ignore next */
      if (mail) {
        const message = 'email: ' + val.email + ' | password: ' + password
        sendMail(val.email, 'Schood Account Created', message)
      }
    }
  } catch (e) {
    console.log(e)
    return [true, line, row]
  }
  return [false, '', -1]
}
