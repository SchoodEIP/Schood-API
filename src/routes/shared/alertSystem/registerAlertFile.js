/**
 * @memberof module:router~mainRouter~sharedRouter~alertSystemRouter
 * @inner
 * @namespace registerAlertFile
 */

const { Alerts } = require("../../../models/alertSystem");
const mongoose = require('mongoose');
const { Files } = require("../../../models/file");
const fs = require('fs')

/**
 * Main register alert file function
 * @name POST /shared/alert/file/:id
 * @function
 * @memberof module:router~mainRouter~sharedRouter~alertSystemRouter~registerAlertFile
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK
 * @returns 400 if Invalid arguments
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    // Verif received data
    const id = req.params.id

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid request' })
    }
    if (!req.file) {
        return res.status(400).json({ message: 'Invalid request' })
    }

    const { originalname, mimetype, path } = req.file
    const binaryData = fs.readFileSync(path) // Access the binary data from multer

    const fileObject = new Files({
        name: originalname,
        mimetype,
        binaryData
    })
    await fileObject.save()

    const alert = await Alerts.findById(id)

    alert.file = fileObject;

    await alert.save()

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
