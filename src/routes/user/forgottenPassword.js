/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace login
 */
const { Users } = require('../../models/users')
const { sendMail } = require('../../services/mailer')

const bcrypt = require('bcryptjs')
const random = require('random-string-generator')
const Logger = require('../../services/logger')
/**
 * Main login function
 * @name POST /user/login
 * @function
 * @memberof module:router~mainRouter~userRouter~login
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 400 if invalid requests
 * @returns 200 if OK or user not found
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    /* istanbul ignore next */
    let mail = Boolean((req.query.mail || '').replace(/\s*(false|null|undefined|0)\s*/i, ''))

    if (!req.query.mail) {
      mail = true
    }

    const email = req.body.email

    if (!email) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    // Check if user exist
    const user = await Users.findOne({ email: req.body.email })
    if (!user) {
      return res.status(200).send()
    }

    // Generating the hash for the password
    const password = random(10, 'alphanumeric')
    await bcrypt.hash(password, 10)
      .then(async (hash) => {
        user.password = hash

        // Save the user
        await user.save()

        /* istanbul ignore next */
        if (mail) {
          const message = 'Your new password is: \n' + 'email: ' + req.body.email + ' | password: ' + password
          sendMail(req.body.email, 'Retrieve Password', message, 'index', {
            title: 'Mot de passe oublié',
            body: `Vous avez fait une demande de récupération de mot de passe.\n\n
            Votre nouveau mot de passe est le suivant:\n\n
            Mot de passe: ${password}\n`,
            connect: true
          })
        }
      })

    // Send token
    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
