const { Resend } = require('resend');

// Render dashboard mein RESEND_API_KEY lazmi daalna
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'MPFL Admin <onboarding@resend.dev>', 
      to: options.email,
      subject: options.subject,
      html: options.message, 
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, error };
    }

    console.log("Email Sent via Resend:", data.id);
    return { success: true, data };
  } catch (err) {
    console.error("Internal Mail Error:", err.message);
    return { success: false, error: err.message };
  }
};

module.exports = sendEmail;