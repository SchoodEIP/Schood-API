/**
 * @memberof module:router~mainRouter~adminRouter~facilityRouter
 * @inner
 * @namespace register
 */
const { Facilities, validateFacilities } = require('../../../models/facilities')

/**
 * Main register function
 * @name POST /admin/facility/register
 * @function
 * @memberof module:router~mainRouter~adminRouter~facilityRouter~register
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 400 if invalid requests
 * @returns 200 if ok
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    // Verify received data
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

    await facility.save()
    res.status(200).json({ message: "ok" })
  } catch (error) /* istanbul ignore next */ {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
