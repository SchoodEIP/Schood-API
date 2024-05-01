/**
 * @memberof module:router~mainRouter~titlesRouter
 * @inner
 * @namespace titles
 */

const { Titles } = require('../../../models/titles')

/**
 * Main titles function
 * @name GET /admin/titles
 * @function
 * @memberof module:router~mainRouter~titlesRouter~titles
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 200 if OK and return access token and role name
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const query = {
      facility: req.user.facility
    }

    const titles = await Titles.find(query)

    return res.status(200).json(titles)
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
