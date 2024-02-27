/**
 * @memberof module:router~mainRouter~adminRouter~facilityRouter
 * @inner
 * @namespace register
 */
const { Facilities, validateUpdate } = require('../../../models/facilities')
const Logger = require('../../../services/logger')
const mongoose = require('mongoose')

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
    const id = req.params.id
    if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid request' })

    const { error } = validateUpdate(req.body)
    if (error) return res.status(400).json({ message: 'Invalid request' })

    const facility = await Facilities.findById(id)
    if (!facility || facility.length === 0) return res.status(404).json({ message: 'This id does not correspond to any facility' })

    facility.name = req.body.name ?? facility.name
    facility.address = req.body.address ?? facility.address
    facility.telephone = req.body.telephone ?? facility.telephone
    facility.level = req.body.level ?? facility.level

    await facility.save()
    res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
