import { models, Op } from "../configs/mysql.js";

/**
 * @param {String} email
 * @param {String} otp
 * @param {Date} expiresAt
 */
async function create(email, otp, expiresAt) {
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

async function findByEmail(email) {
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
    create,
    findByEmail,
};
