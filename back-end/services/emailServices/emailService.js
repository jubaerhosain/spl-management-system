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
import splCommitteeCreationTemplate from "./emailTemplates/splCommitteeCreationTemplate.js";

async function sendEmail(mailOptions) {
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully")
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
 * Send email to users with credentials [{email, password}]
 * @param {Array} credentials
 * @returns
 */
function sendAccountCreationEmail(credentials) {
    return new Promise((resolve, reject) => {
        const promises = credentials.map((user) => {
            const mailOptions = {
                from: config.nodemailer.user,
                to: user.email,
                subject: "Welcome to SPL",
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

async function sendCommitteeCreationEmailToHead(receiverEmail, splName, academicYear) {
    const html = splCommitteeCreationTemplate.committeeHead(splName, academicYear);
    const mailOptions = {
        from: systemEmail,
        to: receiverEmail,
        subject: `Appointment as Committee Head of ${splName.toUpperCase()}, ${academicYear}`,
        html: html,
    };

    await sendEmail(mailOptions);
}

async function sendCommitteeCreationEmailToManager(receiverEmail, splName, academicYear) {
    const html = splCommitteeCreationTemplate.committeeHead(splName, academicYear);
    const mailOptions = {
        from: systemEmail,
        to: receiverEmail,
        subject: `Appointment as SPL Manager of ${splName.toUpperCase()}, ${academicYear}`,
        html: html,
    };

    await sendEmail(mailOptions);
}

function sendCommitteeCreationEmailToMembers(memberEmails, splName, academicYear) {
    return new Promise((resolve, reject) => {
        const promises = memberEmails.map((receiverEmail) => {
            const mailOptions = {
                from: config.nodemailer.user,
                to: receiverEmail,
                subject: `Appointment as Committee Member of ${splName.toUpperCase()}, ${academicYear}`,
                html: splCommitteeCreationTemplate.committeeMember(splName, academicYear),
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
                console.log("Creation creation emails sent successfully to the members");
                resolve(responses);
            })
            .catch((error) => {
                console.log("Error sending committee creation emails to the members: ", error);
                reject(error);
            });
    });
}

export default {
    sendEmailWithOTP,
    sendAccountCreationEmail,
    sendCommitteeCreationEmailToHead,
    sendCommitteeCreationEmailToManager,
    sendCommitteeCreationEmailToMembers
};
