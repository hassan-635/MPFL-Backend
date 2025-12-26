const nodemailer = require("nodemailer");

// Email validation function
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const sendEmail = async (options) => {
  try {
    // Validate email address
    if (!options.email) {
      throw new Error("Email address is required");
    }

    if (!validateEmail(options.email)) {
      throw new Error("Invalid email address format");
    }

    if (!process.env.USER_EMAIL || !process.env.EMAIL_PASS) {
      throw new Error(
        "Email credentials missing in environment variables (USER_EMAIL or EMAIL_PASS)"
      );
    }

    console.log(
      `Attempting to send email via: ${process.env.USER_EMAIL.trim()}`
    );
    console.log(
      `Password configured: ${process.env.EMAIL_PASS ? "YES" : "NO"} (Length: ${
        process.env.EMAIL_PASS.replace(/\s/g, "").length
      })`
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL.trim(),
        pass: process.env.EMAIL_PASS.replace(/\s/g, ""),
      },
    });

    const mailOptions = {
      from: `"MPFL System" <${process.env.USER_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      html: options.message,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", {
      to: options.email,
      subject: options.subject,
      messageId: info.messageId,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email sending failed:", {
      to: options.email,
      error: error.message,
      stack: error.stack,
    });

    // Don't throw - return error info instead
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
