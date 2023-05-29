import bcrypt from "bcrypt";
import generator from "generate-password";

async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

async function verifyPassword(password, hashedPassword) {
    const passwordMatches = await bcrypt.compare(password, hashedPassword);
    return passwordMatches;
}

/**
 * Generates n number of password with hash
 * @param {*} n
 * @returns [{hashedPassword, originalPassword}]
 */
async function generateHashedPassword(numberOfPassword = 1) {
    const passwords = generator.generateMultiple(numberOfPassword, {
        length: 10,
        uppercase: true,
        numbers: true,
        symbols: false,
        lowercase: true,
    });

    const hashedPasswords = [];
    await Promise.all(
        passwords.map(async (password) => {
            hashedPasswords.push({
                originalPassword: password,
                hashedPassword: await hashPassword(password),
            });
        })
    );

    return hashedPasswords;
}

export { hashPassword, verifyPassword, generateHashedPassword };
