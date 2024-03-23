/**
 * @memberof module:router~mainRouter~userRouter
 * @inner
 * @namespace downloadApk
 */
const Logger = require('../../services/logger')

/**
 * Main download apk function
 * @name GET /user/file/:id
 * @function
 * @memberof module:router~mainRouter~userRouter~downloadApk
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const path = process.env.APK_PATH
    
    return res.status(200).download(path, "schood.apk")
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
