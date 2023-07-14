/**
 * @memberof module:router~mainRouter~admRouter~classRouter
 * @inner
 * @namespace register
 */
const { Classes, validateClasses } = require('../../../models/classes')
const { Users } = require('../../../models/users')
const { Facilities } = require('../../../models/facilities')

/**
 * Main register function
 * @name POST /adm/class/register
 * @function
 * @memberof module:router~mainRouter~admRouter~classRouter~register
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 400 if invalid requests
 * @returns 200 if OK
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    // Verif received data
    const { error } = validateClasses(req.body)
    if (error) {
      console.log(error)
      return res.status(400).json({ message: 'Invalid request' })
    }

    const tmp = await Classes.findOne({ name: req.body.name })
    if (tmp) {
      return res.status(422).json({ message: 'This name is already used' })
    }

    const currentUser = await Users.findById(req.user._id)

    const newClass = new Classes({
      name: req.body.name,
      facility: currentUser.facility
    })
    await newClass.save()

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
