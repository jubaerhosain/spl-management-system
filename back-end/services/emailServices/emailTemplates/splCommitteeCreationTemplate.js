import { getSignature } from "./signature.js";

function committeeHead(email, password) {
    const html = `
    <p>Dear Sir,</p>
    
    <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>`;

    return html + getSignature();
}

function splManager(email, password) {
    const html = `
    <p>Dear Sir,</p>

    <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>`;

    return html + getSignature();
}

function committeeMember(email, password) {
    const html = `
    <p>Dear Sir,</p>

    <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>`;

    return html + getSignature();
}

export default {
    committeeHead,
    splManager,
    committeeMember,
};
