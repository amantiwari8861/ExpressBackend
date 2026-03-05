const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
const mjml = require("mjml");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // true if port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function renderMjmlTemplate(templateName, data) {
  const filePath = path.join(__dirname, "../templates", `${templateName}.mjml`);
  const mjmlSource = fs.readFileSync(filePath, "utf8");

  // Inject variables using Handlebars
  const compiledTemplate = handlebars.compile(mjmlSource);
  const mjmlWithData = compiledTemplate(data);

  // Convert MJML → HTML
  const { html } = mjml(mjmlWithData);

  return html;
}

async function sendEmail({ to, subject, templateName, data }) {
  const html = renderMjmlTemplate(templateName, data);

  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}

// Optional: Verify SMTP connection
const verifyMailer = async () => {
  try {
    await transporter.verify();
    console.log("✅ Mail server ready");
  } catch (err) {
    console.error("❌ Mail server error:", err.message);
  }
};

module.exports = { transporter, verifyMailer, sendEmail };
