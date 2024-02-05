/**
 * @memberof module:router~mainRouter~admRouter
 * @inner
 * @namespace class/delete
 */
const { Classes } = require('../../../models/classes')
const Logger = require('../../../services/logger')
const mongoose = require('mongoose')
const { Users, aggregateUsersInClass } = require('../../../models/users')

/**
 * Main register function
 * @name POST /adm/class/register
 * @function
 * @memberof module:router~mainRouter~admRouter~class/register
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
    const id = req.params.id

    if (!id && !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid request' })

    const classToDelete = await Classes.findById(id)
    if (!classToDelete || classToDelete.length === 0) return res.status(422).json({ message: 'No class correspond to this id' })

    const users = await Users.aggregate(aggregateUsersInClass(req.user.facility, id))

    for (const user of users) {
      const classes = user.classes.filter(classId => !classId.equals(id))

      await Users.findOneAndUpdate({ _id: user._id }, { classes })
    }

    await Classes.findByIdAndDelete(id)

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    console.log(error)
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
