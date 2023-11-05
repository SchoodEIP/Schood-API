/**
 * @memberof module:router~mainRouter~sharedRouter~alertSystemRouter
 * @inner
 * @namespace deleteAlert
 */

const { AlertSystem } = require("../../../models/alertSystem");
const mongoose = require('mongoose');

/**
 * Main delete alert function
 * @name DELETE /shared/alert/:id
 * @function
 * @memberof module:router~mainRouter~sharedRouter~alertSystemRouter~deleteAlert
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK and return alert data
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

    const alert = await AlertSystem.findById(id)

    if (!alert) {
        return res.status(400).json({ message: 'Invalid request' })
    }

    if (String(alert.createdBy) !== String(req.user._id)) {
        return res.status(400).json({ message: 'Invalid request' })
    }

    await AlertSystem.findByIdAndDelete(id)

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
