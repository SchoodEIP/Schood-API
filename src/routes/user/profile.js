/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace profile
 */
const { Classes } = require('../../models/classes')
const { Roles } = require('../../models/roles')
const { Users } = require('../../models/users')

/**
 * Main profile function
 * @name GET /user/profile
 * @function
 * @memberof module:router~mainRouter~userRouter~profile
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK and return access token and role name
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const user = await Users.findById(req.user._id)
    const userRole = await Roles.findById(user.role)
    const classes = []

    for (const _class of user.classes) {
      console.log(_class)
      const className = await Classes.findById(_class)
      classes.push(className.name)
    }

    const response = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: userRole.name,
      classes
    }
    // Send profile
    return res.status(200).json(response)
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
