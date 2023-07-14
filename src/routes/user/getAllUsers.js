/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace getAllUsers
 */

const { Users } = require('../../models/users')

/**
 * Main getAllUsers function
 * @name GET /user/by/:position
 * @function
 * @memberof module:router~mainRouter~userRouter~getAllUsers
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
    let positions = []

    if (req.user.role.levelOfAccess >= 3) {
      positions = ['administration', 'admin']
    } else {
      positions = ['student', 'teacher', 'administration']
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
          'role.name': { $in: positions }
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
        $sort: {
          'role.levelOfAccess': -1
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
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
