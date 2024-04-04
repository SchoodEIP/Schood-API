/**
 * @memberof module:router~mainRouter~admRouter
 * @inner
 * @namespace helpNumbersCategory/delete
 */

const { HelpNumbersCategories } = require('../../../models/helpNumbersCategories')
const mongoose = require('mongoose')
const Logger = require('../../../services/logger')
const { HelpNumbers } = require('../../../models/helpNumbers')

/**
 * Main register function
 * @name POST /adm/helpNumbersCategory/register
 * @function
 * @memberof module:router~mainRouter~admRouter~helpNumbersCategory/register
 * @inner
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns 400 if invalid requests
 * @returns 422 if name passed as parameter is already used
 * @returns 200 if OK
 * @returns 500 if Internal Server Error
 */
module.exports = async (req, res) => {
  try {
    const id = req.params.id

    if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid request' })

    const promiseToDelete = HelpNumbersCategories.findOne({ _id: id, facility: req.user.facility })
    const promiseDefaultCategory = HelpNumbersCategories.findOne({ name: 'Default', facility: req.user.facility })
    let [toDelete, defaultCategory] = await Promise.all([promiseToDelete, promiseDefaultCategory])

    if (!toDelete || toDelete.length === 0) return res.status(422).json({ message: 'No HelpNumberCategory correspond to this id' })
    if (toDelete.default) return res.status(401).json({ message: 'Cannot delete the default HelpNumberCategory' })
    if (!defaultCategory || defaultCategory.length === 0) {
      defaultCategory = new HelpNumbersCategories({
        name: 'Default',
        facility: req.user.facility._id,
        default: true
      })

      await defaultCategory.save()
    }

    await HelpNumbers.updateMany(
      {
        facility: req.user.facility,
        helpNumbersCategory: id
      },
      {
        $set: {
          helpNumbersCategory: defaultCategory._id
        }
      }
    )

    await HelpNumbersCategories.findByIdAndDelete(toDelete._id)

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
