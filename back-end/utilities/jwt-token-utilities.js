import jwt from "jsonwebtoken";

function generateToken(obj) {
    const token = jwt.sign(obj, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });
    return token;
}

function verifyToken(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
}

/**
 * Expires in 5 minutes 
 * @param {*} obj 
 * @param {*} customSecret 
 * @returns 
 */
function generateTemporaryTokenByCustomSecret(obj, customSecret) {
    const token = jwt.sign(obj, customSecret, {
        expiresIn: "5m",
    });
    return token;
}

function verifyTokenByCustomSecret(token, customSecret) {
    const decoded = jwt.verify(token, customSecret);
    return decoded;
}

export { generateToken, verifyToken, generateTemporaryTokenByCustomSecret, verifyTokenByCustomSecret };
