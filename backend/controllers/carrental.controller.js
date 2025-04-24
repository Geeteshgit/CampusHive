const CarRental = require("../models/carrental.model");
const User = require("../models/user.model");
const fs = require('fs');
const path = require('path');

const getAllRentals = async (req, res) => {
    try {
        const rentals = await CarRental.find()
        .populate('user', '_id username');
        return res.status(200).json(rentals);
    } catch (err) {
        console.error("Get All Rentals Error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getUserRentals = async (req, res) => {
    try {
        const user = req.user;
        const populatedUser = await user.populate('carrentals');
        const userRentals = populatedUser.carrentals;
        return res.status(200).json(userRentals);
    } catch (err) {
        console.error("Get User Rentals Error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const postRental = async (req, res) => {
    try {
        const user = req.user;
        const vehicleImage = req.file?.filename;
        const { vehicleModel, vehicleDescription, rentalPeriod, rentalAmount, vehicleMileage } = req.body;
        
        if(!vehicleModel || !vehicleImage || !vehicleDescription || !rentalPeriod || !rentalAmount || !vehicleMileage){
            return res.status(400).json({ message: "All fields are required!" });
        }

        const rental = await CarRental.create({
            user : user._id,
            vehicleImage,
            vehicleModel,
            vehicleDescription,
            rentalPeriod,
            rentalAmount,
            vehicleMileage
        });

        user.carrentals.push(rental._id);
        await user.save();
        
        return res.status(201).json(rental);
    } catch (err) {
        console.error("Post Rental Error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const deleteRental = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        
        const deletedRental = await CarRental.findOneAndDelete({_id : id});
        if(!deletedRental) return res.status(404).json({ message: "No rental found!" });

        const imagePath = path.join(__dirname, '../public/uploads', deletedRental.vehicleImage);
        fs.unlink(imagePath, err => {
            if(err) console.log(err.message);
        });

        await User.findOneAndUpdate({ _id : user._id }, { $pull : { carrentals : id }});
        return res.status(200).json({ message: "Rental deleted successfully", deletedRental });
    } catch (err) {
        console.error("Delete Rental Error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { getAllRentals, getUserRentals, postRental, deleteRental }