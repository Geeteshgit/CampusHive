const mongoose = require("mongoose");

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000, 
            socketTimeoutMS: 30000,  
        });
        console.log("Database Connected");
    } catch (err) {
        console.log(err.message);
    }
}

module.exports = connectToDB;