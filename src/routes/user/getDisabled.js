/**
 * @memberof module:router~mainRouter~admRouter
 * @inner
 * @namespace get_disabled
 */
const { Roles } = require('../../models/roles')
const { Users } = require('../../models/users')

const Logger = require('../../services/logger')

/**
 * Main get_disabled function
 * @name GET /adm/get_disabled
 * @function
 * @memberof module:router~mainRouter~admRouter~get_disabled
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
    const isAdmin = req.user.role.levelOfAccess === 3
    const roles = (
      isAdmin
        ? await Roles.find({ levelOfAccess: 2 })
        : await Roles.find({ name: { $in: ['student', 'teacher'] } })
    ).map(o => o._id)
    if (!roles || roles.length === 0) return res.status(400).json({ message: 'Internal server error: No roles found.' })

    const users = await Users.aggregate([
      {
        $match: {
          facility: req.user.facility,
          active: false,
          role: { $in: roles }
        }
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'role',
          foreignField: '_id',
          as: 'role'
        }
      },
      {
        $unwind: {
          path: '$role',
          preserveNullAndEmptyArrays: false
        }
      },

      {
        $lookup: {
          from: 'facilities',
          localField: 'facility',
          foreignField: '_id',
          as: 'facility'
        }
      },
      {
        $unwind: {
          path: '$facility',
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $project: {
          password: 0,
          firstConnexion: 0,
          __v: 0
        }
      }
    ])

    return res.status(200).send(users)
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
