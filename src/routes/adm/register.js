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
 * @returns 401 if invalid username or password
 * @returns 200 if OK and return access token and role name
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    // Verif received data
    const { error } = validateRegister(req.body)
    if (error) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    // Find the role and it's id
    const role = await Roles.findOne({ name: req.body.role })

    // Check if the nb of classes for student is greater than 1
    const classesRequest = req.body.classes
    if (req.body.role === 'student' && classesRequest.length > 1) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    // Check classes
    const classes = []
    classesRequest.forEach(async element => {
      const class_ = await Classes.findOne({ name: element.name })

      if (!class_ || class_ === undefined || class_.length === 0) {
        return res.status(400).json({ message: 'Invalid class' })
      }
      classes.push(class_._id)
    })

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
          classes
        })

        // Save the user
        await user.save()

        const message = 'email: ' + req.body.email + ' | password: '
        sendMail(req.body.email, 'Schood Account Created', message)
      })

    return res.status(200).json({ message: 'OK' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
