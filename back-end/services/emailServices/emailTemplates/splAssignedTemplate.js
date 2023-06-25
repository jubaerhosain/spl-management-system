import { getSignature } from "./signature.js";

function getTemplate(splName, academicYear) {
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
    getTemplate
}