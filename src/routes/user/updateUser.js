/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace updateUser
 */
const { Classes } = require('../../models/classes')
const { Roles } = require('../../models/roles')
const { Users, validateRegister } = require('../../models/users')

/**
 * Main register function
 * @name PATCH /user/user/:id
 * @function
 * @memberof module:router~mainRouter~userRouter~updateUser
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
    // Verif received data
    const id = req.params.id
    if (!id) return res.status(400).json({ message: 'Invalid request' })
    const { error } = validateRegister(req.body)
    if (error) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    const userToUpdate = await Users.findById(id)
    if (!userToUpdate) return res.status(422).json({ message: 'User not found' })

    // Check if role exist
    const role = await Roles.findById(req.body.role)
    if (!role || role.length === 0) {
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

      if (!class_ || class_.length === 0) {
        return res.status(400).json({ message: 'Invalid class' })
      }
      classes.push(class_._id)
    }

    userToUpdate.firstname = req.body.firstname
    userToUpdate.lastname = req.body.lastname
    userToUpdate.email = req.body.email

    if (req.user.role.levelOfAccess >= 2) {
      userToUpdate.role = role._id
      userToUpdate.classes = classes
    }

    await userToUpdate.save()

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
