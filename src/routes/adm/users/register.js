/**
 * @memberof module:router~mainRouter~admRouter
 * @inner
 * @namespace register
 */
const { Classes } = require('../../../models/classes')
const { Roles } = require('../../../models/roles')
const { Users, validateRegister } = require('../../../models/users')

const { sendMail } = require('../../../services/mailer')

const bcrypt = require('bcryptjs')
const random = require('random-string-generator')
const Logger = require('../../../services/logger')
const { Titles } = require('../../../models/titles')

/**
 * Main register function
 * @name POST /adm/register
 * @function
 * @memberof module:router~mainRouter~admRouter~register
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
    /* istanbul ignore next */
    let mail = Boolean((req.query.mail || '').replace(/\s*(false|null|undefined|0)\s*/i, ''))

    if (!req.query.mail) {
      mail = true;
    }

    const userCheck = await Users.find({email: req.body.email})
    if (userCheck) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' })
    }

    // Verif received data
    const { error } = validateRegister(req.body)
    if (error) {
      return res.status(400).json({ message: 'Requête invalide' })
    }

    // Check if role exist
    const role = await Roles.findById(req.body.role)
    if (!role || role === undefined || role.length === 0) {
      return res.status(400).json({ message: 'Role invalide' })
    }

    // Check if the nb of classes for student is greater than 1
    const classesRequest = req.body.classes
    if (role.name === 'student' && classesRequest.length > 1) {
      return res.status(400).json({ message: "Un étudiant ne peut avoir qu'une classe" })
    }

    // Check classes
    const classes = []
    for (const element of classesRequest) {
      const class_ = await Classes.findById(element)

      if (!class_ || class_ === undefined || class_.length === 0) {
        return res.status(400).json({ message: 'Classe introuvable' })
      }
      classes.push(class_._id)
    }

    // Check title
    if (role.levelOfAccess === 1 && req.body.title) {
      const title = await Titles.findById(req.body.title)

      if (!title) {
        return res.status(400).json({ message: 'Titre introuvable' })
      }
    }

    let picture;
    if (req.file) {
      await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(req.file.path, {
          use_filename: true
        }).then((result) => {
          picture = result.secure_url
          resolve();
        })
      })
    }

    // Generating the hash for the password
    const password = random(10, 'alphanumeric')
    await bcrypt.hash(password, 10)
      .then(async (hash) => {
        // We create the user
        const user = new Users({
          email: req.body.email,
          password: hash,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          role: role._id,
          classes,
          facility: req.user.facility._id,
          picture: picture ? picture : undefined,
          title: req.body.title ? req.body.title : undefined
        })

        // Save the user
        await user.save()

        /* istanbul ignore next */
        if (mail) {
          const message = 'email: ' + req.body.email + ' | password: ' + password
          sendMail(req.body.email, 'Compte schood créé', message)
        }
      })

    return res.status(200).send()
  } catch (error) /* istanbul ignore next */ {
    Logger.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
