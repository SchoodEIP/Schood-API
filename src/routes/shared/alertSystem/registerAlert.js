/**
 * @memberof module:router~mainRouter~sharedRouter~alertSystemRouter
 * @inner
 * @namespace alertSystem
 */

const { validateAlert, AlertSystem } = require("../../../models/alertSystem");
const { Classes } = require("../../../models/classes");
const mongoose = require('mongoose');
const { Roles } = require("../../../models/roles");

/**
 * Main register alert function
 * @name POST /shared/alert/
 * @function
 * @memberof module:router~mainRouter~sharedRouter~alertSystemRouter~alertSystem
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
    const { error } = validateAlert(req.body)
    if (error) {
      console.log(error)
      return res.status(400).json({ message: 'Invalid request' })
    }

    let forClasses = false
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
    if (req.body.role && req.body.role.length > 0) {
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

    const alert = new AlertSystem({
        title: req.body.title,
        message: req.body.message,
        file: null,
        forClasses,
        classes: req.body.classes ? req.body.classes : null,
        role: req.body.role ? req.body.role : null,
        createdAt: new Date(),
        createdBy: req.user._id,
        facility: req.user.facility
    })

    await alert.save()

    return res.status(200).send(alert)
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}