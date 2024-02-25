const { Roles } = require('../../models/roles')
const Logger = require('../../services/logger')

module.exports = async () => {
  Logger.info('--------------------------------------------------')
  Logger.info('INFO: Checking defaultRoles')
  const roles = await Roles.find({})
  const rolesToInit = [
    {
      name: 'student',
      levelOfAccess: 0
    },
    {
      name: 'teacher',
      levelOfAccess: 1
    },
    {
      name: 'administration',
      levelOfAccess: 2
    },
    {
      name: 'admin',
      levelOfAccess: 3
    }
  ]

  for (let index = 0; index < rolesToInit.length; index++) {
    const roleToInit = rolesToInit[index]
    if (!roles.find((role) => String(role.name) === roleToInit.name)) {
      Logger.info('INFO: Init default role ' + roleToInit.name)
      const role = new Roles(roleToInit)
      await role.save()
    }
  }
}
