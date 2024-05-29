const { Classes } = require('../../models/classes')
const { Roles } = require('../../models/roles')
const { Titles } = require('../../models/titles')
const { Users } = require('../../models/users')
const Logger = require('../../services/logger')
const bcrypt = require('bcryptjs')

module.exports = async (facility) => {
  Logger.info('--------------------------------------------------')
  Logger.info('INFO: Checking defaultUsers')
  const job = await Roles.findOne({ name: 'job' })
  const student = await Roles.findOne({ name: 'student' })
  const teacher = await Roles.findOne({ name: 'teacher' })
  const adm = await Roles.findOne({ name: 'administration' })

  const mathsTitle = await Titles.findOne({ name: 'Mathématiques' })
  const frenchTitle = await Titles.findOne({ name: 'Français' })
  const admTitle = await Titles.findOne({ name: 'Administrateur Scolaire' })
  const adminTitle = await Titles.findOne({ name: 'Administrateur' })

  const admin = await Roles.findOne({ name: 'admin' })
  const class200 = await Classes.findOne({ name: '200', facility: facility._id })
  const class201 = await Classes.findOne({ name: '201', facility: facility._id })
  const users = await Users.find({ facility: facility._id })

  const defaultUsersToInit = [
    {
      email: 'admin',
      firstname: 'admin',
      lastname: 'admin',
      password: '',
      facility: facility._id,
      role: admin._id,
      title: adminTitle._id
    },
    {
      email: 'analyse',
      firstname: 'analyse',
      lastname: 'analyse',
      password: 'anaylse',
      facility: facility._id,
      role: job._id
    }
  ]
  const defaultDemoUsersToInit = [
    {
      email: 'pierre.dubois',
      firstname: 'Pierre',
      lastname: 'Dubois',
      role: teacher._id,
      facility: facility._id,
      title: mathsTitle._id,
      classes: [class200._id, class201._id],
      picture: 'https://res.cloudinary.com/def3ztvli/image/upload/v1716431987/d959d8e47a1e9fd2293f1b5f9c61a729_gxlcep.png'
    },
    {
      email: 'marie.leclerc',
      firstname: 'Marie',
      lastname: 'Leclerc',
      role: teacher._id,
      title: frenchTitle._id,
      facility: facility._id,
      classes: [class200._id],
      picture: 'https://res.cloudinary.com/def3ztvli/image/upload/v1716432236/f63a229b2d13491d9e5391542bb0786e_gjgqoe.png'
    },
    {
      email: 'alice.johnson',
      firstname: 'Alice',
      lastname: 'Johnson',
      role: student._id,
      facility: facility._id,
      classes: [class200._id],
      picture: 'https://res.cloudinary.com/def3ztvli/image/upload/v1716432465/1c0406f8b439ef28adcabbbca968a92f_ge4aa0.png'
    },
    {
      email: 'jean-pierre.lefevre',
      firstname: 'Jean-Pierre',
      lastname: 'Lefevre',
      role: student._id,
      facility: facility._id,
      classes: [class201._id],
      picture: 'https://res.cloudinary.com/def3ztvli/image/upload/v1716432520/43fc458bcfeb963b3fe9f46b89c9423e_chubor.png'
    },
    {
      email: 'jacqueline.delais',
      firstname: 'Jacqueline',
      lastname: 'Delais',
      facility: facility._id,
      role: adm._id,
      title: admTitle._id,
      picture: 'https://res.cloudinary.com/def3ztvli/image/upload/v1716432346/1a4edab00d40ab5f008893184a2ce487_nbwawv.jpg'
    }
  ]

  for (let index = 0; index < defaultUsersToInit.length; index++) {
    const defaultUserToInit = defaultUsersToInit[index]
    if (!users.find((user) => String(user.email) === defaultUserToInit.email + '.' + facility.name + '@schood.fr')) {
      await bcrypt.hash(String(defaultUserToInit.firstname + '_123'), 10).then(async (hash) => {
        Logger.info('INFO: Init default user ' + defaultUserToInit.firstname + ' ' + defaultUserToInit.lastname)
        const user = new Users({
          email: defaultUserToInit.email + '.' + facility.name + '@schood.fr',
          password: hash,
          firstname: defaultUserToInit.firstname,
          lastname: defaultUserToInit.lastname,
          role: defaultUserToInit.role,
          classes: defaultUserToInit.classes,
          facility: defaultUserToInit.facility,
          title: defaultUserToInit.title,
          picture: defaultUserToInit.picture
        })
        await user.save()
      })
    }
  }

  if (process.env.PROD === 'false') {
    for (let index = 0; index < defaultDemoUsersToInit.length; index++) {
      const defaultDemoUserToInit = defaultDemoUsersToInit[index]
      if (!users.find((user) => String(user.email) === defaultDemoUserToInit.email + '.' + facility.name + '@schood.fr')) {
        await bcrypt.hash(String(defaultDemoUserToInit.firstname + '_123'), 10).then(async (hash) => {
          Logger.info('INFO: Init default user ' + defaultDemoUserToInit.firstname + ' ' + defaultDemoUserToInit.lastname)
          const user = new Users({
            email: defaultDemoUserToInit.email + '.' + facility.name + '@schood.fr',
            password: hash,
            firstname: defaultDemoUserToInit.firstname,
            lastname: defaultDemoUserToInit.lastname,
            role: defaultDemoUserToInit.role,
            classes: defaultDemoUserToInit.classes,
            facility: defaultDemoUserToInit.facility,
            picture: defaultDemoUserToInit.picture
          })
          await user.save()
        })
      }
    }
  }
}
