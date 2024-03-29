/**
 * @memberof module:router~mainRouter~admRouter
 * @inner
 * @namespace register
 */
const { Classes } = require('../../models/classes')
const { Roles } = require('../../models/roles')
const { Users, validateRegister } = require('../../models/users')

const { sendMail } = require('../../services/mailer')

const bcrypt = require('bcryptjs')
const random = require('random-string-generator')
const Logger = require('../../services/logger')

/**
 * Main register function
 * @name POST /adm/register
 * @function
 * @memberof module:router~mainRouter~admRouter~register
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 400 if invalid requests
 * @returns 200 if OK
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    /* istanbul ignore next */
    const mail = Boolean((req.query.mail || '').replace(/\s*(false|null|undefined|0)\s*/i, ''))

    // Verif received data
    const { error } = validateRegister(req.body)
    if (error) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    // Check if role exist
    const role = await Roles.findById(req.body.role)
    if (!role || role === undefined || role.length === 0) {
      return res.status(400).json({ message: 'Invalid role' })
    }

    // Check if the nb of classes for student is greater than 1
    const classesRequest = req.body.classes
    if (role.name === 'student' && classesRequest.length > 1) {
      return res.status(400).json({ message: 'Student can only have 1 class' })
    }

    // Check classes
    const classes = []
    for (const element of classesRequest) {
      const class_ = await Classes.findById(element)

      if (!class_ || class_ === undefined || class_.length === 0) {
        return res.status(400).json({ message: 'Invalid class' })
      }
      classes.push(class_._id)
    }

    // Generating the hash for the password
    const password = random(10, 'alphanumeric')
    await bcrypt.hash(password, 10)
      .then(async (hash) => {
        // We create the user
        const user = new Users({
          email: req.body.email,
          password: hash,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          role: role._id,
          classes,
          facility: req.user.facility._id
        })

        // Save the user
        await user.save()

        /* istanbul ignore next */
        if (mail) {
          const message = 'email: ' + req.body.email + ' | password: ' + password
          sendMail(req.body.email, 'Schood Account Created', message)
        }
      })

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
