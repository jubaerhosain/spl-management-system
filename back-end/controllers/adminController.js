import { models } from "../database/db.js";
import { writeCredentials } from "../utilities/file-utilities.js";
import { generateHashedPassword, verifyPassword } from "../utilities/password-utilities.js";

async function addAdmin(req, res) {
    try {
        const { name, email } = req.body;

        const hashedPasswords = await generateHashedPassword(1);
        const { hashedPassword, originalPassword } = hashedPasswords[0];

        const admin = {
            name: name,
            email: email,
            userType: "admin",
            password: hashedPassword,
        };

        await models.User.create(admin);

        const credentialData = `email: ${email}, password: ${originalPassword}`;
        writeCredentials(new Date() + "\n" + credentialData);

        res.end("admin created successfully");
    } catch (err) {
        console.log(err);
    }
}

export { addAdmin };
