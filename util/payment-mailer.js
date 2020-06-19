const ejs = require('ejs');
const path = require('path');
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL, pass: process.env.PASSWORD } });

module.exports = (user) => {
    ejs.renderFile(path.join(path.dirname(process.mainModule.filename), 'views', 'email', 'paid.ejs'), { errorMessage: 'Payment Successful', user }, function(err, data) {
        if (err) {
            throw new Error(err);
        } else {
            const mainOptions = {
                from: process.env.EMAIL,
                to: user.email,
                subject: 'Payment Confirmation',
                html: data
            };
            transporter.sendMail(mainOptions, function(err, info) {
                if (err) {
                    throw new Error(err);
                }
            });
        }
    });
}