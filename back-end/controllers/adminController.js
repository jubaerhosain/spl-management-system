import { models } from "../data-store/mysql.js";
import fileUtils from "../utils/fileUtils.js";
import passwordUtils from "../utils/passwordUtils.js";

async function addAdmin(req, res) {
    try {
        const { name, email } = req.body;

        const hashedPasswords = await passwordUtils.generateHashedPassword(1);
        const { hashedPassword, originalPassword } = hashedPasswords[0];

        const admin = {
            name: name,
            email: email,
            userType: "admin",
            password: hashedPassword,
        };

        await models.User.create(admin);

        const credentialData = `email: ${email}, password: ${originalPassword}`;
        fileUtils.writeCredentials(new Date() + "\n" + credentialData);

        res.json({
            message: "admin created successfully",
            credentialData,
        });
    } catch (err) {
        console.log(err);
        res.status(500).end("An error occurred while creating admin");
    }
}

export default { addAdmin };
