/**
 * @memberof module:router~mainRouter~titlesRouter
 * @inner
 * @namespace titles
 */

const { default: mongoose } = require('mongoose')
const { Titles } = require('../../../models/titles')

/**
 * Main titles function
 * @name PATCH /admin/titles/:id
 * @function
 * @memberof module:router~mainRouter~titlesRouter~titles
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK and return access token and role name
 * @returns 400 if Invalid arguments
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    // Verif received data
    const id = req.params.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    let title = await Titles.findById(id)
    if (!title) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    if (!req.body.name) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    title = req.body.title

    await title.save()

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
