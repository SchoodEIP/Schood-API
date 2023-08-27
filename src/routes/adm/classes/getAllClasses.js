/**
 * @memberof module:router~mainRouter~admRouter
 * @inner
 * @namespace class/getAllClasses
 */
const { Classes } = require('../../../models/classes')

/**
 * Main register function
 * @name GET /adm/classes
 * @function
 * @memberof module:router~mainRouter~admRouter~classes/getAllClasses
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const classes = await Classes.find({facility: req.user.facility._id});

    return res.status(200).json(classes)
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
