import UserRepository from "../repositories/UserRepository.js";
import CustomError from "../utils/CustomError.js";
import passwordUtils from "../utils/passwordUtils.js";
import fileUtils from "../utils/fileUtils.js";

async function createUserAccount(user) {
    const exists = await UserRepository.findUserId(user.email);

    if (exists) {
        throw new CustomError("User already exists", 400, {
            email: { msg: "Email already exists", value: user.email },
        });
    }

    const password = await passwordUtils.generatePassword(1);

    const newUser = {
        name: user.name,
        email: user.email,
        userType: user.userType,
        password: password[0].hash,
    };

    await UserRepository.create(newUser);

    const credentialData = `email: ${user.email}, password: ${password[0].original}`;
    fileUtils.writeCredentials(new Date() + "\n" + credentialData);
}

async function updateUserAccount(userId, user) {
    await UserRepository.update(userId, user);
}

async function deleteUserAccount(userId) {
    await UserRepository.remove(userId);
}

export default { createUserAccount, updateUserAccount, deleteUserAccount };
