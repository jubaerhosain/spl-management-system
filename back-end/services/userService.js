import UserRepository from "../repositories/UserRepository.js";
import CustomError from "../utils/CustomError.js";
import passwordUtils from "../utils/passwordUtils.js";
import fileUtils from "../utils/fileUtils.js";

async function createUserAccount(user) {
    const exists = await UserRepository.isEmailExists(user.email);

    if (exists) {
        return new CustomError("User already exists", 400, {
            email: { msg: "Email already exists", value: user.email },
        });
    }

    const password = await passwordUtils.generatePassword();

    const admin = {
        name: user.name,
        email: user.email,
        userType: "admin",
        password: password.hash,
    };

    await UserRepository.create(admin);

    const credentialData = `email: ${user.email}, password: ${password.original}`;
    fileUtils.writeCredentials(new Date() + "\n" + credentialData);
}

async function updateUserAccount(user) {}

async function deleteUserAccount(user) {}

export default { createUserAccount };
