const { Users } = require('../models/users')
const { Roles } = require('../models/roles')
const bcrypt = require('bcryptjs')
const { Classes } = require('../models/classes')
const { Facilities } = require('../models/facilities')
const Logger = require('../services/logger')

async function initDefaultUsers () {
  const tmp = await Users.find({ firstname: 'admin' })

  // We check if the db is empty and if it needs to be initialized
  if (tmp === undefined || tmp === null || tmp.length === 0) {
    Logger.info('INFO: Init defaultUsers')
    const student = await Roles.findOne({ name: 'student' })
    const teacher = await Roles.findOne({ name: 'teacher' })
    const adm = await Roles.findOne({ name: 'administration' })
    const admin = await Roles.findOne({ name: 'admin' })

    const class200 = await Classes.findOne({ name: '200' })
    const class201 = await Classes.findOne({ name: '201' })

    const facility = await Facilities.findOne({ name: 'Schood' })

    await bcrypt.hash('admin123', 10).then(async (hash) => {
      // We create a default admin user
      const adminU = new Users({
        email: 'admin@schood.fr',
        firstname: 'admin',
        lastname: 'admin',
        password: hash,
        facility: facility._id,
        role: admin._id
      })

      // Save the user admin
      await adminU.save()
    })

    if (process.env.PROD === 'false') {
      await bcrypt.hash('teacher123', 10).then(async (hash) => {
        // We create a default teacher1 user
        const teacher1 = new Users({
          email: 'teacher1@schood.fr',
          firstname: 'teacher1',
          lastname: 'teacher1',
          password: hash,
          role: teacher._id,
          facility: facility._id,
          classes: [class200._id, class201._id]
        })

        // Save the user teacher1
        await teacher1.save()
      })

      await bcrypt.hash('teacher123', 10).then(async (hash) => {
        // We create a default teacher2 user
        const teacher2 = new Users({
          email: 'teacher2@schood.fr',
          firstname: 'teacher2',
          lastname: 'teacher2',
          password: hash,
          role: teacher._id,
          facility: facility._id,
          classes: [class200._id]
        })

        // Save the user teacher2
        await teacher2.save()
      })

      await bcrypt.hash('student123', 10).then(async (hash) => {
        // We create a default student1 user
        const student1 = new Users({
          email: 'student1@schood.fr',
          firstname: 'student1',
          lastname: 'student1',
          password: hash,
          role: student._id,
          facility: facility._id,
          classes: [class200._id]
        })

        // Save the user student1
        await student1.save()
      })

      await bcrypt.hash('student123', 10).then(async (hash) => {
        // We create a default student2 user
        const student2 = new Users({
          email: 'student2@schood.fr',
          firstname: 'student2',
          lastname: 'student2',
          password: hash,
          role: student._id,
          facility: facility._id,
          classes: [class201._id]
        })

        // Save the user student2
        await student2.save()
      })

      await bcrypt.hash('adm123', 10).then(async (hash) => {
        // We create a default adm user
        const admU = new Users({
          email: 'adm@schood.fr',
          firstname: 'adm',
          lastname: 'adm',
          password: hash,
          facility: facility._id,
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
    Logger.info('INFO: Init defaultRoles')

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

async function initDefaultClasses () {
  const tmp = await Classes.find()
  const facility = await Facilities.findOne({ name: 'Schood' })

  // We check if the db is empty and if it needs to be initialized
  if (tmp === undefined || tmp === null || tmp.length === 0) {
    Logger.info('INFO: Init defaultClasses')

    const class1 = new Classes({
      name: '200',
      facility: facility._id
    })

    const class2 = new Classes({
      name: '201',
      facility: facility._id
    })

    await class1.save()
    await class2.save()
  }
}

async function initDefaultFacility () {
  const tmp = await Facilities.find()

  // We check if the db is empty and if it needs to be initialized
  if (tmp === undefined || tmp === null || tmp.length === 0) {
    Logger.info('INFO: Init defaultFacilities')

    const facility = new Facilities({
      name: 'Schood',
      address: '1 rue schood',
      telephone: '0102030405',
      level: 4
    })

    await facility.save()
  }
}

module.exports = async (test = false) => {
  if (test) Logger.displayed = false
  await initDefaultFacility()
  await initDefaultRoles()
  if (process.env.PROD === 'false') {
    await initDefaultClasses()
  }
  await initDefaultUsers()
  if (test) Logger.displayed = true
}
