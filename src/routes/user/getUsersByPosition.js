/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace getUsersByPosition
 */

const { Users } = require('../../models/users')
const Logger = require('../../services/logger')

/**
 * Main getUsersByPosition function
 * @name GET /user/by/:position
 * @function
 * @memberof module:router~mainRouter~userRouter~getUsersByPosition
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 403 if Insufficent access
 * @returns 200 if OK
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const position = req.params.position

    if (position === 'admin' && req.user.role.levelOfAccess < 3) {
      return res.status(403).json({ message: 'Insufficent access' })
    } else if (['student', 'teacher'].includes(position) && req.user.role.levelOfAccess >= 3) {
      return res.status(403).json({ message: 'Insufficent access' })
    }
    const agg = [
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
        $match: {
          'role.name': position
        }
      },
      {
        $lookup: {
          from: 'classes',
          localField: 'classes',
          foreignField: '_id',
          as: 'classes'
        }
      },
      {
        $unwind: {
          path: '$classes',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          password: 0
        }
      }
    ]
    const result = await Users.aggregate(agg)

    return res.status(200).json(result)
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
