import { getSignature } from "./signature.js";

function getTemplate(name, otp) {
    const html = `<p>Dear ${name},</p>

    <p>I hope this email finds you well. We are reaching out to you to complete the account 
    verification process for your SPL account. To proceed, we kindly request that 
    you use the following One-Time Password (OTP):</p>

    <p><strong>OTP:</strong> ${otp}</p>

    <p>Please note that the OTP is valid for 5 minutes. If it expires before you have 
    a chance to use it, you can request a new OTP by following the "Forgot Password" process on our website. </p>

    <p>Link of our website: <a href="www.google.com">click</a></p>

    <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>`;

    return html + getSignature();
}

export default {
    getTemplate,
};
