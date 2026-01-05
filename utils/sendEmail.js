const axios = require('axios');

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const sendEmail = async (options) => {
  try {
    if (!options.email || !validateEmail(options.email)) {
      throw new Error('Invalid or missing recipient email');
    }

    const webhook = process.env.N8N_WEBHOOK_URL;
    if (!webhook) throw new Error('N8N webhook URL not configured');

    const payload = {
      to: options.email,
      subject: options.subject,
      html: options.message,
      meta: options.meta || {}
    };

    const headers = {};
    if (process.env.N8N_WEBHOOK_TOKEN) {
      headers['x-n8n-webhook-token'] = process.env.N8N_WEBHOOK_TOKEN;
    }

    const res = await axios.post(webhook, payload, { headers, timeout: 15000 });

    if (res.status >= 200 && res.status < 300) {
      return { success: true, data: res.data };
    }

    return { success: false, status: res.status, data: res.data };
  } catch (err) {
    console.error('sendEmail error:', err.message || err);
    return { success: false, error: err.message || 'Unknown error' };
  }
};

module.exports = sendEmail;











// const nodemailer = require("nodemailer");

// // Email validation function
// const validateEmail = (email) => {
//   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return regex.test(email);
// };

// const sendEmail = async (options) => {
//   try {
//     // Validate email address
//     if (!options.email) {
//       throw new Error("Email address is required");
//     }

//     if (!validateEmail(options.email)) {
//       throw new Error("Invalid email address format");
//     }

//     if (!process.env.USER_EMAIL || !process.env.EMAIL_PASS) {
//       throw new Error(
//         "Email credentials missing in environment variables (USER_EMAIL or EMAIL_PASS)"
//       );
//     }

//     console.log(
//       `Attempting to send email via: ${process.env.USER_EMAIL.trim()}`
//     );
//     console.log(
//       `Password configured: ${process.env.EMAIL_PASS ? "YES" : "NO"} (Length: ${
//         process.env.EMAIL_PASS.replace(/\s/g, "").length
//       })`
//     );

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true,
//       auth: {
//         user: process.env.USER_EMAIL.trim(),
//         pass: process.env.EMAIL_PASS.replace(/\s/g, ""),
//       },
//       tls: {
//         rejectUnauthorized: false,
//       },
//     });

//     const mailOptions = {
//       from: `"MPFL Admin :" <${process.env.USER_EMAIL}>`,
//       to: options.email,
//       subject: options.subject,
//       html: options.message,
//       connectionTimeout: 20000, // 10 seconds
//       greetingTimeout: 20000,
//       socketTimeout: 20000,
//     };

//     const info = await transporter.sendMail(mailOptions);

//     console.log("Email sent successfully:", {
//       to: options.email,
//       subject: options.subject,
//       messageId: info.messageId,
//     });
//     return { success: true, messageId: info.messageId };
//   } catch (error) {
//     console.error("Email sending failed:", {
//       to: options.email,
//       error: error.message,
//       stack: error.stack,
//     });

//     // Don't throw - return error info instead
//     return { success: false, error: error.message };
//   }
// };

// module.exports = sendEmail;
