import { getSignature } from "./signature.js";

function getTemplate(email, password) {
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

    <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>`;

    return html + getSignature();
}

export default {
    getTemplate,
};
