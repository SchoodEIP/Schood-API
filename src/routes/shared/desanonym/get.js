/**
 * @memberof module:router~mainRouter~desanonymsRouter
 * @inner
 * @namespace desanonyms
 */

const { Desanonyms } = require('../../../models/desanonym')

/**
 * Main desanonyms function
 * @name GET /shared/desanonyms
 * @function
 * @memberof module:router~mainRouter~desanonymsRouter~desanonyms
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK and return access token and role name
 * @returns 400 if Invalid arguments
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const query = {
      facility: req.user.facility
    }

    if (req.user.role.levelOfAccess === 2) {
      query.createdBy = req.user._id
    }

    if (req.user.role.levelOfAccess === 0) {
      query.user = req.user._id
    }
    const desanonyms = await Desanonyms.find(query).populate('createdBy').populate('user')

    desanonyms.forEach(desanonym => {
      if (desanonym.user) {
        desanonym.user.password = undefined
        desanonym.user.classes = undefined
        desanonym.user.firstConnexion = undefined
        desanonym.user.facility = undefined
        desanonym.user.role = undefined
      }

      if (desanonym.createdBy) {
        desanonym.createdBy.password = undefined
        desanonym.createdBy.classes = undefined
        desanonym.createdBy.firstConnexion = undefined
        desanonym.createdBy.facility = undefined
        desanonym.createdBy.role = undefined
      }
    });

    return res.status(200).json(desanonyms)
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
