/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace downloadFile
 */
const { Files } = require('../../models/file')

/**
 * Main download file function
 * @name GET /user/file/:id
 * @function
 * @memberof module:router~mainRouter~userRouter~downloadFile
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
    if (!id) return res.status(400).json({ message: 'Invalid request' })

    const file = await Files.findById(id)
    if (!file || file.length === 0) return res.status(400).json({ message: 'Invalid request' })

    res.setHeader('Content-Type', file.mimetype)
    res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`)
    return res.status(200).send(file.binaryData)
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
