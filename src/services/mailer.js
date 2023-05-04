const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAIL_PASSWORD
    }
});

const sendMail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.MAIL,
        to,
        subject,
        text
    }

    transporter.sendMail(mailOptions, function(error) {
        if (error) {
            console.error(error);
        }
    })
}

module.exports = { sendMail }