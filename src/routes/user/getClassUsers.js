/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace getClassUsers
 */

const { Users } = require('../../models/users')
const mongoose = require('mongoose')

/**
 * Main getClassUsers function
 * @name GET /user/class/:id
 * @function
 * @memberof module:router~mainRouter~userRouter~getClassUsers
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const id = req.params.id

    if (!id && !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid request' })

    console.log(id)
    const agg = [
      {
        $match: {
          facility: req.user.facility
        }
      },
      {
        $match:
          {
            classes:
              {
                $eq: new mongoose.Types.ObjectId(id)
              }
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
