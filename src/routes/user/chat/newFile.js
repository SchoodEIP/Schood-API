/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace newFile
 */
const { Chats } = require('../../../models/chat')
const { Messages } = require('../../../models/message')
const { Files } = require('../../../models/file')
const fs = require('fs')
const Logger = require('../../../services/logger')

/**
 * Main new file function
 * @name POST /user/chat/:id/newFile
 * @function
 * @memberof module:router~mainRouter~userRouter~newFile
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK
 * @returns 400 if invalid requests
 * @returns 422 if user does not participate in this chat
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    // Verif received id
    const id = req.params.id
    const chat = await Chats.findById(id)
    if (!chat || chat.length === 0) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const { originalname, mimetype, path } = req.file
    const binaryData = fs.readFileSync(path) // Access the binary data from multer

    if (!chat.participants.find((user) => user.user.equals(req.user._id))) {
      return res.status(422).json({ message: 'User does not participate in this chat' })
    }

    const newFile = new Files({
      name: originalname,
      mimetype,
      binaryData
    })
    await newFile.save()

    const newMessage = new Messages({
      date: new Date(),
      user: req.user._id,
      file: newFile._id,
      chat: chat._id,
      facility: req.user.facility
    })
    if (req.body.content) newMessage.content = req.body.content

    await newMessage.save()
    chat.messages.push(newMessage._id)
    await chat.save()

    res.setHeader('Content-Type', newFile.mimetype)
    res.setHeader('Content-Disposition', `attachment; filename="${newFile.originalName}"`)
    return res.status(200).send(newFile.binaryData)
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
