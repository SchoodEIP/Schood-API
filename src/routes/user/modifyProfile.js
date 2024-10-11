/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace modifyProfile
 */
const { Users } = require('../../models/users')
const { Classes } = require('../../models/classes')
const { Roles } = require('../../models/roles')
const Logger = require('../../services/logger')
const cloudinary = require('cloudinary')
/**
 * Main modifyProfile function
 * @name PATCH /user/modifyProfile
 * @function
 * @memberof module:router~mainRouter~userRouter~modifyProfile
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
    const userId = req.params.id

    if ((req.body.firstname || req.body.lastname) && req.user.role.levelOfAccess < 2) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    const user = await Users.findById(userId)

    if (req.file) {
      await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(req.file.path, {
          use_filename: true
        }).then((result) => {
          user.picture = result.secure_url
          resolve()
        })
      })
    }

    // Check if role exist
    const role = await Roles.findById(req.body.role)
    if (!role || role.length === 0) {
      console.log(role)
      return res.status(400).json({ message: 'Invalid role' })
    }

    // Check if the nb of classes for student is greater than 1
    let classesRequest

      try {
        classesRequest = JSON.parse(req.body.classes);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid classes format' });
      }

    if (role.name === 'student' && classesRequest.length > 1) {
      return res.status(400).json({ message: 'Student can only have 1 class' })
    }

    const classes = []
    for (const element of classesRequest) {
      const class_ = await Classes.findById(element._id)

      if (!class_ || class_.length === 0) {
        return res.status(400).json({ message: 'Invalid class' })
      }
      classes.push(class_._id)
    }

    user.firstname = req.body.firstname ? req.body.firstname : user.firstname
    user.lastname = req.body.lastname ? req.body.lastname : user.lastname
    user.email = req.body.email ? req.body.email : user.email
    user.classes = classes

    await user.save()

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
