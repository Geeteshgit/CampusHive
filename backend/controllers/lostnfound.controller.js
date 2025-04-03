const LostnFound = require("../models/lostnfound.model");
const User = require("../models/user.model");
const fs = require('fs');
const path = require('path');

const getAllItems = async (req, res) => {
    try {
        const items = await LostnFound.find()
        .populate('user', '_id');
        return res.status(200).json(items);
    } catch (err) {
        console.error("Get All Items Error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getUserItems = async (req, res) => {
    try {
        const user = req.user;
        const populatedUser = await user.populate('lostnfounds');
        const userItems = populatedUser.lostnfounds;
        return res.status(200).json(userItems);
    } catch (err) {
        console.error("Get User Items Error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const postItem = async (req, res) => {
    try {
        const user = req.user;
        const itemImage = req.file?.filename;
        const { itemName, itemDescription, itemStatus } = req.body;
        
        if( !itemImage || !itemName || !itemDescription || !itemStatus ){
            return res.status(400).json({ message: "All fields are required!" });
        }

        const item = await LostnFound.create({
            user : user._id,
            itemImage,
            itemName,
            itemDescription,
            itemStatus,
        });

        user.lostnfounds.push(item._id);
        await user.save();
        
        return res.status(201).json(item);
    } catch (err) {
        console.error("Post Item Error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        
        const deletedItem = await LostnFound.findOneAndDelete({_id : id});
        if (!deletedItem) return res.status(404).json({ message: "No item found!" });

        const imagePath = path.join(__dirname, '../public/uploads', deletedItem.itemImage);
        fs.unlink(imagePath, err => {
            if (err) console.error("Image Deletion Error:", err.message);
        });

        await User.findOneAndUpdate({ _id : user._id }, { $pull : { lostnfounds : id }});
        return res.status(200).json({ message: "Item deleted successfully", deletedItem });
    } catch (err) {
        console.error("Delete Item Error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { getAllItems, getUserItems, postItem, deleteItem }