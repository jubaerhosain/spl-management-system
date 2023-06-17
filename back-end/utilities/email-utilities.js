"use strict";

import nodemailer from "nodemailer";
import { nodemailerConfig } from "../config/nodemailer-config.js";

const transporter = nodemailer.createTransport({
    service: nodemailerConfig.service,
    auth: {
        user: nodemailerConfig.user,
        pass: nodemailerConfig.password,
    },
});

const thanks = `<p> Best Regards, <br>
                    The SPL Management System Team <br>
                    IIT, University of Dhaka
                </p>`;

async function sendEmailWithOTP(receiverEmail, name, otp) {
    const html = `<p>Dear ${name},</p>

    <p>I hope this email finds you well. We are reaching out to you to complete the account 
    verification process for your SPL account. To proceed, we kindly request that 
    you use the following One-Time Password (OTP):</p>

    <p><strong>OTP:</strong> ${otp}</p>

    <p>Please note that the OTP is valid for 5 minutes. If it expires before you have 
    a chance to use it, you can request a new OTP by following the "Forgot Password" process on our website. </p>

    <p>Link of our website: <a href="www.google.com">click</a></p>

    <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>

    <p>Best regards,<br>
    The SPL Management System Team <br>
    IIT, University of Dhaka</p>`;

    const mailOptions = {
        from: nodemailerConfig.user,
        to: receiverEmail,
        subject: "One-Time Password (OTP) for Account Verification",
        html: html,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.log("Error sending email: ", err);
        throw new Error("Internal server error");
    }
}

/**
 *
 * @param {*} receiver
 * @param {*} subject
 * @param {*} html
 * @returns
 */
async function sendEmail(receiver, subject, html) {
    const mailOptions = {
        from: nodemailerConfig.user,
        to: receiver,
        subject: subject,
        html: html + thanks,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.log("Error sending email: ", err);
        throw new Error("Internal server error");
    }
}

function sendMultipleEmail(receivers, subject, html) {
    return new Promise((resolve, reject) => {
        const promises = receivers.map((email) => {
            const mailOptions = {
                from: nodemailerConfig.user,
                to: email,
                subject: subject,
                html: html + thanks,
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
                console.log("All email sent successfully");
                resolve(responses);
            })
            .catch((error) => {
                console.log("Error sending emails: ", error);
                reject(error);
            });
    });
}

function getAccountCreationEmailBody(email, password) {
    const html = `
    <p>Dear User,</p>

    <p>Welcome to SPL Management System! We are excited to have you onboard.</p>

    <p>Your account has been created successfully, and here are your login credentials:</p>

    <p><strong>Email:</strong> ${email} <br>
    <strong>Temporary Password:</strong> ${password} </p>

    <p>Please log in to your account using these credentials and reset your password. It is important to reset your password as soon as possible to ensure your account's security.</p>

    <p>We take the security of your account seriously and encourage you to take the following precautions to ensure that your information remains secure:</p>

    <ul>
        <li>Keep your password safe and do not share it with anyone.</li>
        <li>Use a strong, unique password that is not easily guessable.</li>
        <li>Avoid using the same password for multiple accounts.</li>
        <li>Always log out of your account when you're finished using it, especially if you're using a shared computer or device.</li>
        <li>Be wary of phishing emails and never provide your password or other sensitive information in response to unsolicited requests.</li>
    </ul>

    <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>

    <p>Best regards,<br>
    The SPL Management System Team <br>
    IIT, University of Dhaka</p>`;

    return html;
}

/**
 * Send email to users with credentials
 * @param {*} users
 * @returns
 */
function sendAccountCreationEmail(users) {
    return new Promise((resolve, reject) => {
        const promises = users.map((user) => {
            const mailOptions = {
                from: nodemailerConfig.user,
                to: user.email,
                subject: "Welcome to SPL Management System",
                html: getAccountCreationEmailBody(user.email, user.password),
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
                console.log("All email sent successfully");
                resolve(responses);
            })
            .catch((error) => {
                console.log("Error sending emails: ", error);
                reject(error);
            });
    });
}

export { sendEmail, sendEmailWithOTP, sendMultipleEmail, sendAccountCreationEmail };
