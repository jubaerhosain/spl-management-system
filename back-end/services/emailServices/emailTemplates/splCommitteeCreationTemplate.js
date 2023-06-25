import { getSignature } from "./signature.js";

function committeeHead(splName, academicYear) {
    const html = `
    <p>Dear Sir,</p>

    <p>We are pleased to inform you that you have been appointed 
    as the Committee Head of the ${splName.toUpperCase()}, ${academicYear}.</p>
    
    <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>`;

    return html + getSignature();
}

function splManager(splName, academicYear) {
    const html = `
    <p>Dear Sir,</p>

    <p>We are pleased to inform you that you have been appointed 
    as the SPL Manager of the ${splName.toUpperCase()}, ${academicYear}.</p>

    <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>`;

    return html + getSignature();
}

function committeeMember(splName, academicYear) {
    const html = `
    <p>Dear Sir,</p>

    <p>We are pleased to inform you that you have been appointed 
    as the Committee Member of the ${splName.toUpperCase()}, ${academicYear}.</p>

    <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>`;

    return html + getSignature();
}

export default {
    committeeHead,
    splManager,
    committeeMember,
};
