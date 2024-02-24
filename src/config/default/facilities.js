const { Facilities } = require("../../models/facilities")
const Logger = require("../../services/logger")

module.exports = async () => {
    Logger.info('--------------------------------------------------')
    Logger.info('INFO: check defaultFacilities')
    const facilities = await Facilities.find({})
    const facilitiesToInit = [
        {
            name: 'Schood1',
            address: '1 rue schood',
            telephone: '0102030405',
            level: 4
        },
        {
            name: 'Schood2',
            address: '1 rue schood',
            telephone: '0102030405',
            level: 4
        }
    ]

    for (let index = 0; index < facilitiesToInit.length; index++) {
        const facilityToInit = facilitiesToInit[index];

        if (!facilities.find((facility) => String(facility.name) === facilityToInit.name)) {
            Logger.info('INFO: Init facility ' + facilityToInit.name)

            const facility = new Facilities(facilityToInit)
            await facility.save()
        }
    }
}