/**
 * @memberof module:router~mainRouter~admRouter~classesRouter
 * @inner
 * @namespace getAllClasses
 */
const { Classes } = require('../../../models/classes')
const Logger = require('../../../services/logger')

/**
 * Main register function
 * @name GET /shared/classes
 * @functionsharedRouter
 * @memberof module:router~mainRouter~admRouter~classesRouter~getAllClasses
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    if (req.user.role.levelOfAccess === 1) {
      return res.status(200).json(req.user.classes)
    } else {
      const classes = await Classes.find({ facility: req.user.facility._id })
      return res.status(200).json(classes)
    }
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
