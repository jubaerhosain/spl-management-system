import bcrypt from "bcrypt";

async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

async function verifyPassword(password, hashedPassword) {
    const passwordMatches = await bcrypt.compare(password, hashedPassword);
    return passwordMatches;
}

export { hashPassword, verifyPassword };
