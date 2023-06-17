import jwt from "jsonwebtoken";

function generateToken(obj) {
    const token = jwt.sign(obj, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });
    return token;
}

function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (err) {
        return false;
    }
}

export default { generateToken, verifyToken };
