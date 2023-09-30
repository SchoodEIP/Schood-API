const multer = require('multer')

const upload10Tmp = multer({
  dest: '/tmp',
  limits: { fileSize: 10485760 } // 10 Mo
})

module.exports = {
  upload10Tmp
}
