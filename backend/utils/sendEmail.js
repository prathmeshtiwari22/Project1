const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
host: process.env.EMAIL_HOST,
port: process.env.EMAIL_PORT,
secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS
}
});


async function sendEmail(to, subject, html) {
const info = await transporter.sendMail({
from: process.env.FROM_EMAIL,
to,
subject,
html
});
return info;
}


module.exports = sendEmail;