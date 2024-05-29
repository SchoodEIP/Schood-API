/**
 * @memberof module:router~mainRouter~admRouter
 * @inner
 * @namespace csvRegisterUser
 */
const { Users } = require('../../../models/users')
const csvParser = require('csv-parser')
const fs = require('fs')
const { Roles } = require('../../../models/roles')
const bcrypt = require('bcryptjs')
const random = require('random-string-generator')
const { Classes } = require('../../../models/classes')
const { sendMail } = require('../../../services/mailer')
const Logger = require('../../../services/logger')
const { Titles } = require('../../../models/titles')

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
    let mail = Boolean((req.query.mail || '').replace(/\s*(false|null|undefined|0)\s*/i, ''))

    if (!req.query.mail) {
      mail = true
    }
    // Verify received data
    if (req.file.size === 0) { return res.status(422).json({ message: 'Le fichier est vide' }) }

    const csv = await convertCsv(req.file.path)
    if (!csv || csv.length === 0) { return res.status(422).json({ message: 'Requête invalide' }) }

    if (checkCsvHeader(csv[0])) { return res.status(422).json({ message: 'Le header du csv est invalide' }) }

    const error = await checkCsvBody(csv)
    if (error.length !== 0) {
      return res.status(422).json(error)
    }

    const [err, line, row] = await processImport(csv, mail, req.user)
    if (err) {
      return res.status(422).json({
        line,
        row
      })
    }

    return res.status(200).json('ok')
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
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
          resolve(csv?.map(row => { return { ...row, classes: row.class.split(':') } }))
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
  const keys = ['firstname', 'lastname', 'email', 'role', 'class', 'classes', 'title', 'picture']

  for (const key of Object.keys(row)) {
    if (!keys.includes(key)) { return true }
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
    if (idx === -1) { error.push({ rowCSV: index + 2, errors: [errorType], ...csv[index] }) } else { error[idx].errors.push(errorType) }
  }

  const emails = []
  for (const [index, row] of csv.entries()) {
    if (row.firstname.length === 0 || !/^([a-zA-Z]| |-)+$/.test(row.firstname)) addError("Le prénom n'est pas valide", index)
    if (row.lastname.length === 0 || !/^([a-zA-Z]| |-)+$/.test(row.lastname)) addError("Le nom de famille n'est pas valide", index)
    if (row.email.length === 0 || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(row.email)) addError("L'email n'est pas valide", index)
    if (row.role.length === 0 || !['student', 'teacher', 'administration'].includes(row.role.toLowerCase())) addError("Le rôle n'est pas valide", index)
    if (row.classes.length === 0) addError("La classe n'est pas valide", index)
    row.classes.forEach((className) => {
      if (className === 0 || !/^([a-zA-Z0-9]| |-)+$/.test(className)) { addError("La classe n'est pas valide", index) }
    })
    if (row.role === 'student' && row.classes.length > 1) addError("Un étudiant ne peut avoir qu'une classe", index)

    if (row.role === 'teacher' && row.title && !await Titles.findById(row.title)) {
      addError("Le titre n'existe pas", index)
    }

    if (await Users.findOne({ email: row.email })) {
      addError('Un utilisateur avec cet email existe déjà', index)
    }

    if (emails.includes(row.email)) {
      addError('Un autre utilisateur a déjà cet email dans le csv', index)
    } else {
      emails.push(row.email)
    }

    for (const class_ of row.classes) {
      const foundClass = await Classes.findOne({ name: class_ })
      if (!foundClass) {
        addError(`La classe ${class_} n'existe pas`, index)
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
const processImport = async (csv, mail, currentUser) => {
  let line
  let row
  try {
    for (const [index, val] of csv.entries()) {
      line = index
      row = val

      const password = random(10, 'alphanumeric')
      const role = await Roles.findOne({ name: val.role })
      const classes = []
      for (let index = 0; index < row.classes.length; index++) {
        const element = row.classes[index]
        const classId = await Classes.findOne({ name: element })
        classes.push(classId._id)
      }
      const user = new Users({
        ...val,
        firstname: val.firstname,
        lastname: val.lastname,
        email: val.email,
        classes,
        role,
        password: await bcrypt.hash(password, 10),
        facility: currentUser.facility,
        picture: val.picture ? val.picture : undefined,
        title: val.title ? val.title : undefined
      })
      await user.save()

      /* istanbul ignore next */
      if (mail) {
        const message = 'email: ' + val.email + ' | password: ' + password
        sendMail(val.email, 'Compte Schood créé', message)
      }
    }
  } catch (e) /* istanbul ignore next */ {
    Logger.error(e)
    return [true, line, row]
  }
  return [false, '', -1]
}
