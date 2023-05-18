/**
 * @memberof module:router~mainRouter~facilityRouter
 * @inner
 * @namespace register
 */
const { Facilities, validateFacilities } = require('../../../models/facilities')

/**
 * Main register function
 * @name POST /facility/register
 * @function
 * @memberof module:router~mainRouter~facilityRouter~register
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 400 if invalid requests
 * @returns 401 if invalid username or password
 * @returns 200 if ok and return access token and role name
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    // Verif received data
    const { error } = validateFacilities(req.body)
    if (error) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    const facility = new Facilities({
      name: req.body.name,
      address: req.body.address,
      telephone: req.body.telephone,
      level: req.body.level
    })

    facility.save()
    res.status(200).json({ message: 'ok' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
