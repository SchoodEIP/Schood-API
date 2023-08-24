/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace getChats
 */
const { Chats } = require('../../../models/chat')

/**
 * Main login function
 * @name GET /user/chat
 * @function
 * @memberof module:router~mainRouter~userRouter~getChats
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK and send JSON containing an array of chats
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const agg = [
      {
        $match: {
          participants: req.user._id
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'participants',
          foreignField: '_id',
          as: 'participants'
        }
      },
      {
        $project: {
          _id: 1,
          facility: 1,
          date: 1,
          createdBy: 1,
          messages: 1,
          participants: {
            _id: 1,
            email: 1,
            firstname: 1,
            lastname: 1
          }
        }
      },
      {
        $lookup: {
          from: 'messages',
          localField: 'messages',
          foreignField: '_id',
          as: 'messages'
        }
      },
      {
        $project: {
          _id: 1,
          facility: 1,
          date: 1,
          createdBy: 1,
          messages: {
            _id: 1,
            user: 1,
            date: 1,
            content: 1,
            file: 1
          },
          participants: 1
        }
      }
    ]

    const chats = await Chats.aggregate(agg)
    return res.status(200).json(chats)
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
