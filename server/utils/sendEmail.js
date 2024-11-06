const nodemailer = require('nodemailer');

const sendEmail = async ({ email, subject, message }) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, // e.g., smtp.gmail.com
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS, // Your email password or app-specific password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: email, // List of recipients
        subject: subject, // Subject line
        text: message, 
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
