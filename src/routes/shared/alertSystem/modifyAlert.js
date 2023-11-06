/**
 * @memberof module:router~mainRouter~sharedRouter~alertSystemRouter
 * @inner
 * @namespace modifyAlert
 */

const { Alerts } = require("../../../models/alertSystem");
const { Classes } = require("../../../models/classes");
const mongoose = require('mongoose');
const { Roles } = require("../../../models/roles");

/**
 * Main modify alert function
 * @name PATCH /shared/alert/:id
 * @function
 * @memberof module:router~mainRouter~sharedRouter~alertSystemRouter~modifyAlert
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

    let forClasses
    if (req.body.classes) {
        if (!Array.isArray(req.body.classes)) {
            return res.status(400).json({ message: 'Invalid request' })
        }
        if (req.body.classes.length > 0 ) {
            for (let index = 0; index < req.body.classes.length; index++) {
                const _class = req.body.classes[index];
                if (!mongoose.Types.ObjectId.isValid(_class)) {
                    return res.status(400).json({ message: 'Invalid request' })
                }
                const classData = await Classes.findById(_class)
    
                if (!classData) {
                    return res.status(400).json({ message: 'Invalid request' })
                }
            }
            forClasses = true
        }
    }
    if (req.body.role) {
        if (forClasses) {
            return res.status(400).json({ message: 'Invalid request' })
        }
        const role = req.body.role
        if (!mongoose.Types.ObjectId.isValid(role)) {
            return res.status(400).json({ message: 'Invalid request' })
        }
        
        const roleData = await Roles.findById(role)
        if (!roleData) {
            return res.status(400).json({ message: 'Invalid request' })
        }
    } else {
        if (!forClasses) {
            return res.status(400).json({ message: 'Invalid request' })
        }
    }

    const alert = await Alerts.findById(id)

    alert.title = req.body.title ? req.body.title : alert.title
    alert.message = req.body.message ? req.body.message : alert.message
    alert.forClasses = forClasses ? forClasses : alert.forClasses
    alert.classes = req.body.classes ? req.body.classes : alert.classes
    alert.role = req.body.role ? req.body.role : alert.role

    await alert.save()

    return res.status(200).send(alert)
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
