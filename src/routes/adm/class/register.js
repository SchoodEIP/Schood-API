/**
 * @memberof module:router~mainRouter~admRouter
 * @inner
 * @namespace class/register
 */
const { Classes, validateClasses } = require('../../../models/classes')

/**
 * Main register function
 * @name POST /adm/class/register
 * @function
 * @memberof module:router~mainRouter~admRouter~class/register
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
    if (tmp) return res.status(422).json({ message: 'This name is already used' })

    const newClass = new Classes({
      name: req.body.name,
      facility: req.user.facility._id
    })
    await newClass.save()

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
