function getSignature() {
    const signature = `
    <p> 
        Best Regards, <br>
        The SPL Management System Team <br>
        IIT, University of Dhaka
    </p>`;
    return signature;
}

function getAccountCreationTemplate(email, password) {
    const html = `
    <p>Dear User,</p>

    <p>Welcome to SPL Management System! We are excited to have you onboard.</p>

    <p>Your account has been created successfully, and here are your login credentials:</p>

    <p><strong>Email:</strong> ${email} <br>
    <strong>Temporary Password:</strong> ${password} </p>

    <p>Please log in to your account using these credentials and reset your password. It is important 
    to reset your password as soon as possible to ensure your account's security.</p>

    <p>We take the security of your account seriously and encourage you to take the following precautions 
    to ensure that your information remains secure:</p>

    <ul>
        <li>Keep your password safe and do not share it with anyone.</li>
        <li>Use a strong, unique password that is not easily guessable.</li>
        <li>Avoid using the same password for multiple accounts.</li>
        <li>Always log out of your account when you're finished using it, especially if you're using a 
        shared computer or device.</li>
        <li>Be wary of phishing emails and never provide your password or other sensitive information 
        in response to unsolicited requests.</li>
    </ul>

    <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>`;

    return html + getSignature();
}

function getSendOTPTemplate(otp) {
    const html = `<p>Dear user,</p>

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

function getCommitteeCreationTemplateForHead(splName, academicYear) {
    const html = `
    <p>Dear Sir,</p>

    <p>We are pleased to inform you that you have been appointed 
    as the Committee Head of the ${splName.toUpperCase()}, ${academicYear}.</p>
    
    <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>`;

    return html + getSignature();
}

function getCommitteeCreationTemplateForManager(splName, academicYear) {
    const html = `
    <p>Dear Sir,</p>

    <p>We are pleased to inform you that you have been appointed 
    as the SPL Manager of the ${splName.toUpperCase()}, ${academicYear}.</p>

    <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>`;

    return html + getSignature();
}

function getCommitteeCreationTemplateForMember(splName, academicYear) {
    const html = `
    <p>Dear Sir,</p>

    <p>We are pleased to inform you that you have been appointed 
    as the Committee Member of the ${splName.toUpperCase()}, ${academicYear}.</p>

    <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>`;

    return html + getSignature();
}

function getAssignedToSPLTemplate(splName, academicYear) {
    const html = `
    <p>Dear Student,</p>

    <p>You have been assigned 
    to ${splName.toUpperCase()}, ${academicYear}.</p>

    ${
        splName == "spl2"
            ? "<p>Now you can search and request supervisor after creating team.</p>"
            : ""
    }
    ${splName == "spl3" ? "Now you can search and request supervisor." : ""}
    
    <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>`;

    return html + getSignature();
}

export default {
    getAccountCreationTemplate,
    getSendOTPTemplate,
    getCommitteeCreationTemplateForHead,
    getCommitteeCreationTemplateForManager,
    getCommitteeCreationTemplateForMember,
    getAssignedToSPLTemplate,
};
