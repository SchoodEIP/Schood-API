/**
 * @memberof module:router~mainRouter~sharedRouter~alertSystemRouter
 * @inner
 * @namespace getAlerts
 */

const { Alerts } = require('../../../models/alertSystem')

/**
 * Main get alert function
 * @name GET /shared/alert/:id
 * @function
 * @memberof module:router~mainRouter~sharedRouter~alertSystemRouter~getAlerts
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
    const userClasses = req.user.classes.map((class_) => class_._id)

    const alerts = await Alerts.find({
      $or: [
        {
          classes: { $in: userClasses }
        },
        {
          role: req.user.role._id
        }
      ]
    }).sort({ createdAt: -1 }).populate('createdBy').populate({
      path: 'createdBy',
      populate: [
        {
          path: "title"
        }
      ]
    })

    return res.status(200).json(alerts)
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
