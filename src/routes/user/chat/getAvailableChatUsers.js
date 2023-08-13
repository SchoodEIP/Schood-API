/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace getAvailableChatUsers
 */

const { Users } = require('../../../models/users')
const { Roles } = require('../../../models/roles')

/**
 * Main getAllUsers function
 * @name GET /user/chat/users
 * @function
 * @memberof module:router~mainRouter~userRouter~getAvailableChatUsers
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const roles = [
      (await Roles.findOne({ levelOfAccess: 1 }))._id,
      (await Roles.findOne({ levelOfAccess: 2 }))._id
    ]
    if (req.user.role.levelOfAccess >= 1) roles.push((await Roles.findOne({ levelOfAccess: 0 }))._id)

    const agg = [
      {
        $match: {
          facility: req.user.facility,
          _id: { $nin: [req.user._id] },
          role: { $in: roles }
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
