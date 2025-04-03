const mongoose = require("mongoose");

const carPoolSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    pickupPoint : {
        type : String,
        required : true
    },
    destinationPoint : {
        type : String,
        required : true
    },
    pickupTime : {
        type : String,
        required : true
    },
    requiredPeople : {
        type : Number,
        min : 1,
    }
},
{
    timestamps : true
});

const CarPool = mongoose.model('CarPool', carPoolSchema);
module.exports = CarPool;