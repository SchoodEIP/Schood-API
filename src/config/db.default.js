const { Users } = require('../models/user')
const bcrypt = require('bcryptjs')

async function initDefaultUsers () {
  const tmp = await Users.find({ username: 'admin' })

  // We check if the db is empty and if it needs to be initialized
  if (tmp === undefined || tmp === null || tmp.length === 0) {
    console.log('INFO: Init defaultUsers')

    await bcrypt.hash('admin123', 10).then(async (hash) => {
      // We create a default admin user
      const admin = new Users({
        username: 'admin',
        password: hash
      })

      // Save the user admin
      await admin.save()
    })
  }
}

module.exports = async () => {
  await initDefaultUsers()
}
