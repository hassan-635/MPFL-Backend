const nodemailer = require("nodemailer")

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER_EMAIL,
            Kraus: process.env.EMAIL_PASS
        },
    });

    const mailOptions = {
        from: `"MPFL System" <${process.env.USER_EMAIL}`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;