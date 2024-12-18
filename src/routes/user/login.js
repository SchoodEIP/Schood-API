/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace login
 */
const { Users, validateUser } = require('../../models/users')
const bcrypt = require('bcryptjs')
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
 * @returns 401 if invalid username or password
 * @returns 200 if OK and return access token and role name
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    // Verif received data
    const { error } = validateUser(req.body)
    if (error) {
      return res.status(400).json({ message: 'Invalid request' })
    }
    const user = await Users.findOne({ email: req.body.email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    // Check password
    let badUsername = false
    await bcrypt.compare(req.body.password, user.password).then(valid => {
      if (!valid) { badUsername = true }
    })

    if (badUsername) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    if (!user.active) {
      return res.status(403).json({ message: 'Cet utilisateur est suspendu.' })
    }

    // Generate AuthToken
    const token = user.generateAuthToken(req.body.rememberMe)
    const firstConnexion = user.firstConnexion

    // Send token
    return res.status(200).json({ token, firstConnexion })
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
