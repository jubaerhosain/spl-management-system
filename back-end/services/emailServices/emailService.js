"use strict";

import nodemailer from "nodemailer";
import config from "../../config/config.js";

const transporter = nodemailer.createTransport({
    service: config.nodemailer.service,
    auth: {
        user: config.nodemailer.user,
        pass: config.nodemailer.password,
    },
});

const systemEmail = config.nodemailer.user;

// =================================================================

import sendOTPTemplate from "./emailTemplates/sendOTPTemplate.js";
import accountCreationTemplate from "./emailTemplates/accountCreationTemplate.js";

async function sendEmail(mailOptions) {
    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.log("Error sending email: ", err);
        throw new Error("Internal server error");
    }
}

async function sendEmailWithOTP(receiverEmail, otp) {
    const html = sendOTPTemplate.getTemplate(otp);
    const mailOptions = {
        from: systemEmail,
        to: receiverEmail,
        subject: "One-Time Password (OTP) for Account Verification",
        html: html,
    };

    await sendEmail(mailOptions);
}

/**
 * Send email to users with credentials
 * @param {Array} users
 * @returns
 */
function sendAccountCreationEmail(users) {
    return new Promise((resolve, reject) => {
        const promises = users.map((user) => {
            const mailOptions = {
                from: nodemailerConfig.user,
                to: user.email,
                subject: "Welcome to SPL Management System",
                html: accountCreationTemplate.getTemplate(user.email, user.password),
            };

            return new Promise((resolve, reject) => {
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(info.response);
                    }
                });
            });
        });

        Promise.all(promises)
            .then((responses) => {
                console.log("Account creation emails sent successfully");
                resolve(responses);
            })
            .catch((error) => {
                console.log("Error sending account creation emails: ", error);
                reject(error);
            });
    });
}

export default { sendEmailWithOTP, sendAccountCreationEmail };
