import { models, Op } from "../database/db.js";

/**
 * @param {String} email
 * @param {String} otp
 * @param {Date} expiresAt
 */
async function createOTP(email, otp, expiresAt) {
    const OTP = await models.OTP.findOne({
        where: {
            email: email,
        },
        raw: true,
    });

    if (!OTP) {
        await models.OTP.create({ email: email, otp: otp, expiresAt: expiresAt });
    } else {
        await models.OTP.update(
            { otp: otp, expiresAt: expiresAt },
            {
                where: {
                    email: email,
                },
            }
        );
    }
}

async function findOTP(email) {
    const otp = await models.OTP.findOne({
        where: {
            email,
            expiresAt: {
                [Op.gt]: new Date(),
            },
        },
        raw: true,
    });

    if (otp) return otp.otp;
    return null;
}

export default {
    createOTP,
    findOTP,
};
