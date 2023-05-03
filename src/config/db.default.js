const { Users } = require('../models/user')
const { Roles } = require('../models/roles')
const bcrypt = require('bcryptjs')

async function initDefaultUsers () {
  const tmp = await Users.find({ username: 'admin' })

  // We check if the db is empty and if it needs to be initialized
  if (tmp === undefined || tmp === null || tmp.length === 0) {
    console.log('INFO: Init defaultUsers')

    await bcrypt.hash('admin123', 10).then(async (hash) => {
      // We create a default admin user
      const admin = new Users({
        mail: 'admin@schood.fr',
        password: hash
      })

      // Save the user admin
      await admin.save()
    })
  }
}

async function initDefaultRoles () {
  const tmp = await Roles.find()

  // We check if the db is empty and if it needs to be initialized
  if (tmp === undefined || tmp === null || tmp.length === 0) {
    console.log('INFO: Init defaultRoles')

    const student = new Roles({
      name: 'student',
      levelOfAccess: 0
    })

    const teacher = new Roles({
      name: 'teacher',
      levelOfAccess: 1
    })

    const adm = new Roles({
      name: 'administration',
      levelOfAccess: 2
    })

    const admin = new Roles({
      name: 'admin',
      levelOfAccess: 3
    })

    await student.save()
    await teacher.save()
    await adm.save()
    await admin.save()
  }
}

module.exports = async () => {
  await initDefaultUsers()
  await initDefaultRoles()
}
