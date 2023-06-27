"use strict";
import config from "../../config/config.js";
import nodemailer from "nodemailer";
import templates from "./templates.js";

const transporter = nodemailer.createTransport({
    service: config.nodemailer.service,
    auth: {
        user: config.nodemailer.user,
        pass: config.nodemailer.password,
    },
});
const systemEmail = config.nodemailer.user;

async function sendEmailWithOTP(receiverEmail, otp) {
    const html = templates.getSendOTPTemplate(otp);
    const mailOptions = {
        from: systemEmail,
        to: receiverEmail,
        subject: "One-Time Password (OTP) for Account Verification",
        html: html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email with otp sent successfully");
    } catch (err) {
        console.log("Error sending email with OTP: ", err);
        throw new Error(err);
    }
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
                html: templates.getAccountCreationTemplate(user.email, user.password),
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
                console.log("Account creation emails are sent successfully");
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
                console.log("Committee creation emails sent successfully to the members");
                resolve(responses);
            })
            .catch((error) => {
                console.log("Error sending committee creation emails to the members: ", error);
                reject(error);
            });
    });
}

/**
 * @param {string} headEmail
 * @param {string} managerEmail
 * @param {Array} memberEmails
 * @param {string} splName
 * @param {string} academicYear
 */
function sendCommitteeCreationEmail(headEmail, managerEmail, memberEmails, splName, academicYear) {}

function sendAssignedToSPLEmail(studentEmails, splName, academicYear) {
    return new Promise((resolve, reject) => {
        const promises = studentEmails.map((receiverEmail) => {
            const mailOptions = {
                from: config.nodemailer.user,
                to: receiverEmail,
                subject: `Assigned to ${splName.toUpperCase()}, ${academicYear}`,
                html: splAssignedTemplate.getTemplate(splName, academicYear),
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
                console.log("SPL Assigned emails sent successfully to the students");
                resolve(responses);
            })
            .catch((error) => {
                console.log("Error sending SPL Assigned emails to the students: ", error);
                reject(error);
            });
    });
}

export default {
    sendEmailWithOTP,
    sendAccountCreationEmail,
    sendCommitteeCreationEmail,
    sendAssignedToSPLEmail,
};
