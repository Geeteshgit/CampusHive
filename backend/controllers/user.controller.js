const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const User = require("../models/user.model");
const Project = require("../models/project.model");
const CarPool = require("../models/carpool.model");
const CarRental = require("../models/carrental.model");
const LostnFound = require("../models/lostnfound.model");

const getUser = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json(user);
    } catch (err) {
        console.error("Get User Error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getSelectedUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) return res.status(404).json({ message: "User not found!" });
      
      return res.status(200).json(user);
    } catch (err) {
        console.error("Get Selected User Error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const updateUser = async (req, res) => {   
    try {
        const user = req.user;
        const { username, oldPassword, newPassword, confirmPassword } = req.body;
        
        if(username) user.username = username;

        if(req.file) {
            const oldImage = user.profilePhoto;
            user.profilePhoto = req.file.filename;

            if(oldImage && oldImage !== '/user.jpg') {
                const imagePath = path.join(__dirname, '../public/uploads' , oldImage);
                fs.unlink(imagePath, err => {
                    if (err) console.error(err.message);
                });
            }
        }

        if(newPassword && confirmPassword) {
            if (!oldPassword || !newPassword || !confirmPassword) {
                return res.status(400).json({ message: "All password fields are required!" });
            }    

            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if(!isMatch) return res.status(401).json({ message: "Old password is incorrect" });

            if(newPassword !== confirmPassword) return res.status(409).json({ message: "New passwords do not match!" });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        await user.save();
        return res.status(200).json({ message: "Profile updated successfully!" });

    } catch (err) {
        console.error("Update User Error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ message: "Unauthorized" });

        if(user.profilePhoto !== '/user.jpg') {
            const imagePath = path.join(__dirname, '../public/uploads', user.profilePhoto);
            fs.unlink(imagePath, err => {
                if (err) console.error(err.message);
            });
        }
        
        await Project.deleteMany({ user : user._id });
        await CarPool.deleteMany({ user : user._id });
        await CarRental.deleteMany({ user : user._id });
        await LostnFound.deleteMany({user : user._id });
        await User.deleteOne({ _id : user._id });

        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            path: "/",
        });
        
        return res.status(200).json({ message: "User account deleted successfully" });
    } catch (err) {
        console.error("Delete User Error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { getUser, getSelectedUser, updateUser, deleteUser }
