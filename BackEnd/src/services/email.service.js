const nodemailer = require("nodemailer");
const { email } = require("../config/env.config");

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: email.host,
    port: email.port,
    auth: {
      user: email.user,
      pass: email.pass,
    },
  });

  const mailOptions = {
    from: `Email Verify App ${email.email_from}`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
