const { transporter } = require("../config/mailer");

const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
