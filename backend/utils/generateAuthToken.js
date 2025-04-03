const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "30d";

const generateToken = (id) => {
    const token = jwt.sign({ id: id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return token;
};

module.exports = generateToken;