const { Notifications } = require('../models/notifications')
const { Roles } = require('../models/roles')
const { Users } = require('../models/users')

const createNotificationForAllAdmins = async (title, message, topic, topicId, facility) => {
  const adminRole = await Roles.findOne({ name: 'admin' })
  const admins = await Users.find({ role: adminRole._id, facility })

  for (let index = 0; index < admins.length; index++) {
    const admin = admins[index]

    const notification = new Notifications({
      concernedUser: admin._id,
      title,
      message,
      topic,
      topicId: topicId || null,
      facility
    })

    await notification.save()
  }
}

const createNotificationForAllAdministrations = async (title, message, topic, topicId, facility) => {
  const administrationRole = await Roles.findOne({ name: 'administration' })
  const administrations = await Users.find({ role: administrationRole._id, facility })

  for (let index = 0; index < administrations.length; index++) {
    const administration = administrations[index]

    const notification = new Notifications({
      concernedUser: administration._id,
      title,
      message,
      topic,
      topicId: topicId || null,
      facility
    })

    await notification.save()
  }
}

const createNotificationForAllTeachers = async (title, message, topic, topicId, facility) => {
  const teacherRole = await Roles.findOne({ name: 'teacher' })
  const teachers = await Users.find({ role: teacherRole._id, facility })

  for (let index = 0; index < teachers.length; index++) {
    const teacher = teachers[index]

    const notification = new Notifications({
      concernedUser: teacher._id,
      title,
      message,
      topic,
      topicId: topicId || null,
      facility
    })

    await notification.save()
  }
}

const createNotificationForAllStudents = async (title, message, topic, topicId, facility) => {
  const studentRole = await Roles.findOne({ name: 'student' })
  const students = await Users.find({ role: studentRole._id, facility })

  for (let index = 0; index < students.length; index++) {
    const student = students[index]

    const notification = new Notifications({
      concernedUser: student._id,
      title,
      message,
      topic,
      topicId: topicId || null,
      facility
    })

    await notification.save()
  }
}

const createNotificationForAllStudentOfClass = async (classId, title, message, topic, topicId, facility) => {
  const students = await Users.find({ classes: classId, facility })

  for (let index = 0; index < students.length; index++) {
    const student = students[index]

    const notification = new Notifications({
      concernedUser: student._id,
      title,
      message,
      topic,
      topicId: topicId || null,
      facility
    })

    await notification.save()
  }
}

const createNotification = async (concernedUser, title, message, topic, topicId, facility) => {
  const notification = new Notifications({
    concernedUser,
    title,
    message,
    topic,
    topicId: topicId || null,
    facility
  })

  await notification.save()
}

const createNotificationForRole = async (role, title, message, topic, topicId, facility) => {
  switch (role) {
    case 'student':
      createNotificationForAllStudents(title, message, topic, topicId, facility)
      break
    case 'teacher':
      createNotificationForAllTeachers(title, message, topic, topicId, facility)
      break
    case 'administration':
      createNotificationForAllAdministrations(title, message, topic, topicId, facility)
      break
    case 'admin':
      createNotificationForAllAdmins(title, message, topic, topicId, facility)
      break
    default:
      break
  }
}

module.exports = { createNotification, createNotificationForAllAdmins, createNotificationForAllAdministrations, createNotificationForAllTeachers, createNotificationForAllStudents, createNotificationForAllStudentOfClass, createNotificationForRole }
