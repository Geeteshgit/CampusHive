const CarPool = require("../models/carpool.model");
const User = require("../models/user.model");

const getAllCarpools = async (req, res) => {
    try {
        const carpools = await CarPool.find().populate('user', 'username');
        return res.status(200).json(carpools);
    } catch (err) {
        console.error("Get All Carpools Error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getUserRides = async (req, res) => {
    try {
        const user = req.user;
        const populatedUser = await user.populate('carpools');
        const userRides = populatedUser.carpools;
        return res.status(200).json(userRides);
    } catch (err) {
        console.error("Get User Rides Error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const postCarpool = async (req, res) => {
    try {
        const user = req.user;
        const { pickupPoint, destinationPoint, pickupTime, requiredPeople } = req.body;
        
        if(!pickupPoint || !destinationPoint || !pickupTime || !requiredPeople){
            return res.status(400).json({ message: "All fields are required!" });
        }
        
        const carpool = await CarPool.create({
            user : user._id,
            pickupPoint,
            destinationPoint,
            pickupTime,
            requiredPeople
        });

        user.carpools.push(carpool._id);
        await user.save();
        
        return res.status(201).json(carpool);
    } catch (err) {
        console.error("Post Carpool Error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const deleteCarpool = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;

        const deletedCarpool = await CarPool.findOneAndDelete({_id : id});

        if (!deletedCarpool) return res.status(404).json({ message: "No carpool found!" });

        await User.findOneAndUpdate({ _id : user._id}, { $pull : { carpools : id }});
        return res.status(200).json({ message: "Carpool deleted successfully", deletedCarpool });
    } catch (err) {
        console.error("Delete Carpool Error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { getAllCarpools, getUserRides, postCarpool, deleteCarpool }