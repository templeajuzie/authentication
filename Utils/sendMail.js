"use strict";
const nodemailer = require("nodemailer");

const sendMail = async (options) => {

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        service: process.env.SMTP_SERVICE,
        // secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_MAIL, // generated ethereal user
            pass: process.env.SMTP_PASS // generated ethereal password
        },
    });

    const mailOptions = {
        // should be replaced with real recipient's account
        from: process.env.SMTP_MAIL, // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body
        // html: "<b>Hello world?</b>", // html body
    };

    await transporter.sendMail(mailOptions)

   
}

module.exports = sendMail;
