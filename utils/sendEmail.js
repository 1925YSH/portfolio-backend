const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,     // Your Gmail
      pass: process.env.SMTP_PASSWORD  // App password
    }
  });

  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.SMTP_MAIL}>`,
    to: process.env.SMTP_MAIL, // ✅ send to yourself, not visitor
    subject: options.subject || `New Contact Message from ${options.name}`,
    text: `You received a new message:

Name: ${options.name}
Email: ${options.email}

Message:
${options.message}`
  };

  await transporter.sendMail(mailOptions);
  console.log('✅ Email sent to your inbox');
};

module.exports = sendEmail;
