const nodemailer = require('nodemailer')
const Logger = require('./logger')

const viewPath =  path.resolve(__dirname, './templates/views/');
const partialsPath = path.resolve(__dirname, './templates/partials');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASSWORD
  }
})

transporter.use('compile', hbs({
  viewEngine: {
    extName: '.handlebars',
    layoutsDir: viewPath,
    defaultLayout: false,
    partialsDir: partialsPath,
    express
  },
  viewPath: viewPath,
  extName: '.handlebars',
}));

const sendMail = (to, subject, text, template = null) => {
  let mailOptions = {};
  if (template) {
    mailOptions = {
      from: process.env.MAIL,
      to,
      subject,
      template,
      text
    }
  } else {
    mailOptions = {
      from: process.env.MAIL,
      to,
      subject,
      text
    }
  }

  transporter.sendMail(mailOptions, function (error) {
    if (error) {
      Logger.error(error)
    }
  })
}

module.exports = { sendMail }
