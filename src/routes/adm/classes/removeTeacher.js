/**
 * @memberof module:router~mainRouter~admRouter
 * @inner
 * @namespace class/update
 */
const { Classes, validateTeacher, getTeacher } = require('../../../models/classes')
const Logger = require('../../../services/logger')
const mongoose = require('mongoose')
const { Users } = require('../../../models/users')
const { isTeacher } = require('../../../models/roles')

/**
 * Main update function
 * @name PATCH /adm/class/:id
 * @function
 * @memberof module:router~mainRouter~admRouter~class/update
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 400 if invalid requests
 * @returns 200 if OK
 * @returns 422 if class not found or name already used
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    // Verif received data
    const id = req.params.id

    if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid request' })

    const { error } = validateTeacher(req.body)
    if (error) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    const classToUpdate = await Classes.findById(id)
    if (!classToUpdate) return res.status(422).json({ message: 'Class not found' })

    const userToUpdate = await Users.findById(req.body.teacherId)
    if (!(await isTeacher(userToUpdate))) return res.status(422).json({ message: 'User is not a teacher' })

    if (!userToUpdate.classes.includes(id)) return res.status(422).json({ message: 'User is not a teacher of this class' })

    userToUpdate.classes = userToUpdate.classes.filter((_class) => !_class.equals(id))
    await userToUpdate.save()

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
