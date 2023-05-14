const { Users } = require('../models/users')
const { Roles } = require('../models/roles')
const bcrypt = require('bcryptjs')

async function initDefaultUsers () {
  const tmp = await Users.find({ username: 'admin' })

  // We check if the db is empty and if it needs to be initialized
  if (tmp === undefined || tmp === null || tmp.length === 0) {
    console.log('INFO: Init defaultUsers')
    const student = Roles.findOne({name: 'student'})
    const teacher = Roles.findOne({name: 'teacher'})
    const adm = Roles.findOne({name: 'administration'})
    const admin = Roles.findOne({name: 'admin'})

    await bcrypt.hash('admin123', 10).then(async (hash) => {
      // We create a default admin user
      const adminU = new Users({
        email: 'admin@schood.fr',
        firstname: "admin",
        lastname: "admin",
        password: hash,
        role: admin._id
      })

      // Save the user admin
      await adminU.save()
    })

    if (process.env.PROD === 'true') {
      await bcrypt.hash('teacher123', 10).then(async (hash) => {
        // We create a default teacher1 user
        const teacher1 = new Users({
          email: 'teacher1@schood.fr',
          firstname: "teacher1",
          lastname: "teacher1",
          password: hash,
          role: teacher._id
        })

        // Save the user teacher1
        await teacher1.save()
      })

      await bcrypt.hash('teacher123', 10).then(async (hash) => {
        // We create a default teacher2 user
        const teacher2 = new Users({
          email: 'teacher2@schood.fr',
          firstname: "teacher2",
          lastname: "teacher2",
          password: hash,
          role: teacher._id
        })

        // Save the user teacher2
        await teacher2.save()
      })

      await bcrypt.hash('student123', 10).then(async (hash) => {
        // We create a default student1 user
        const student1 = new Users({
          email: 'student1@schood.fr',
          firstname: "student1",
          lastname: "student1",
          password: hash,
          role: student._id
        })

        // Save the user student1
        await student1.save()
      })

      await bcrypt.hash('student123', 10).then(async (hash) => {
        // We create a default student2 user
        const student2 = new Users({
          email: 'student2@schood.fr',
          firstname: "student2",
          lastname: "student2",
          password: hash,
          role: student._id
        })

        // Save the user student2
        await student2.save()
      })

      await bcrypt.hash('adm123', 10).then(async (hash) => {
        // We create a default adm user
        const admU = new Users({
          email: 'adm@schood.fr',
          firstname: "adm",
          lastname: "adm",
          password: hash,
          role: adm._id
        })

        // Save the user adm
        await admU.save()
      })
    }
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
  await initDefaultRoles()
  await initDefaultUsers()
}
