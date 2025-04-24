const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const generateAuthToken = require("../utils/generateAuthToken.js");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const register = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        if(!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        if(password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters!" });
        }

        if(password != confirmPassword) {
            return res.status(409).json({ message: "Passwords do not match!" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({ message: "User already exists!" });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username,
            email,
            password : hash,
        });

        const user = await User.findById(newUser._id).select("-password");
        const token = generateAuthToken(user._id);

        res.cookie("token", token, {
            httpOnly : true,
            secure: true,
            sameSite : "None",
            path : "/",
        });

        return res.status(201).json({ message: "User registered successfully!", user });

    } catch (err) {
        console.error("Register Error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });     
    }
}

const login = async (req, res) => {
    try {
        const { email , password } = req.body;

        if(!email || !password) return res.status(400).json({ message: "All fields are required!" });

        const user = await User.findOne({ email });
        if(!user) return res.status(404).json({ message: "User doesn't exist!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).json({ message: "Email or Password Invalid!" });

        const loggedInUser = await User.findById(user._id).select("-password");
        const token = generateAuthToken(loggedInUser._id);

        res.cookie("token", token, {
            httpOnly : true,
            secure : true,
            sameSite : "None",
            path : "/",
        });

        return res.status(200).json({ message: "Logged In Successfully", user: loggedInUser });
        
    } catch (err) {
        console.error("Login Error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}   

const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            path: "/",
        });
        
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error("Logout Error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ message: "Credential is missing" });
        }

        const ticket = await client.verifyIdToken({
          idToken: credential,
          audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const { email, name, picture, sub: googleId } = payload;

        let user = await User.findOne({ email });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(googleId, salt);

        if (!user) {
          user = await User.create({
            username: name,
            email,
            googleId,
            profilePhoto: picture,
            password: hashedPassword,
          });
        }

        const token = generateAuthToken(user._id);

        res.cookie("token", token, {
            httpOnly : true,
            secure : true,
            sameSite : "None",
            path : "/",
        });
        
        return res.status(200).json({ user });

    } catch (err) {
        return res.status(500).json({ message: "Google Login Failed" });
    }
}


const getCurrentUser = async (req, res) => {

    const token = req.cookies.token;
    if (!token) return res.status(200).json({ user: null });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) return res.status(200).json({ user: null });

        return res.status(200).json({ user });

    } catch (err) {
        return res.status(200).json({ user: null });
    }
}   

module.exports = { register, login, logout, getCurrentUser, googleLogin };