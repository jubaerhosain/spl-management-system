import { generateSinglePassword } from "./strong-password-generator.js";
import { hashPassword } from "./bcrypt-password-utilities.js";


/**
 *
 * @param {Array} emails - user emails
 * @returns {Promise} [{email, password(hashed), originalPassword}]
 */
async function createUserFromEmail(emails) {
    const users = [];
    await Promise.all(
        emails.map(async (email) => {
            const password = await generateSinglePassword();
            users.push({
                email: email,
                password: await hashPassword(password),
                originalPassword: password,
            });
        })
    );

    return users;
}

export { createUserFromEmail };
