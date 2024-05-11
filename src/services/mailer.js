const nodemailer = require('nodemailer')
const Logger = require('./logger')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASSWORD
  }
})

const sendMail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.MAIL,
    to,
    subject,
    text
  }

  console.log("mailOptions:", mailOptions)

  transporter.sendMail(mailOptions, function (error) {
    if (error) {
      Logger.error(error)
    }
  })
}

module.exports = { sendMail }
