/**
 * @memberof module:router~mainRouter~admRouter
 * @inner
 * @namespace rolesList
 */

const { Roles } = require('../../models/roles')

/**
 * Main profile function
 * @name GET /adm/rolesList
 * @function
 * @memberof module:router~mainRouter~admRouter~rolesList
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK and return an array filled with all roles
 * @returns 422 if an errors occurs on fetching roles
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const response = (await Roles.find()).map(role => ({
      levelOfAccess: role.levelOfAccess,
      name: role.name
    }))

    if (!response) { return res.status(422) }
    return res.status(200).json({ roles: response })
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
