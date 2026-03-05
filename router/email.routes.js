const express = require("express");
const { sendEmail } = require("../services/email.service");

const emailRoutes = express.Router();

emailRoutes.post("/send", async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await sendEmail({
      to,
      subject,
      text: message,
      html: `<p>${message}</p>`,
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = emailRoutes;
