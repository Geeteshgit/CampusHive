const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const checkAuth = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if(!user) return res.status(401).send("Unauthorized: User not found!");

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}

module.exports = checkAuth;