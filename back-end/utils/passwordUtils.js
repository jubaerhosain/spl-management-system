import bcrypt from "bcrypt";
import generator from "generate-password";

export async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

export async function verifyPassword(password, hashedPassword) {
    const passwordMatches = await bcrypt.compare(password, hashedPassword);
    return passwordMatches;
}

/**
 * Generates password and corresponding hash
 * @param {*} n number of password to be generated
 * @returns [{ original, hash }]
 */
export async function generatePassword(n = 1) {
    const passwords = generator.generateMultiple(n, {
        length: 10,
        uppercase: true,
        numbers: true,
        symbols: false,
        lowercase: true,
    });

    const passwordsWithHash = [];
    await Promise.all(
        passwords.map(async (password) => {
            passwordsWithHash.push({
                original: password,
                hash: await hashPassword(password),
            });
        })
    );

    return passwordsWithHash;
}

/**
 * Generate a n digit otp. Default length is 6.
 * @param {Integer} length
 * @returns
 */
export function generateOTP(numberOfDigit = 6) {
    let otp = "";
    for (let i = 0; i < numberOfDigit; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
}

export default { hashPassword, verifyPassword, generatePassword, generateOTP };
