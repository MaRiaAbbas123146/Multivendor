require('dotenv').config(); // ensure env variables are loaded
const nodemailer = require("nodemailer");

// Create transporter using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendMail = async (options) => {
  const mailOptions = {
    from: process.env.SMTP_MAIL, // sender
    to: options.email,           // recipient
    subject: options.subject,
    text: options.message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return info; // important for route to use
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // propagate error to caller
  }
};

module.exports = sendMail;
