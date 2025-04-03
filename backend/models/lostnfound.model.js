const mongoose = require("mongoose");

const lostnFoundSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    itemImage : {
        type : String,
        required : true
    },
    itemName : {
        type : String,
        required : true
    },
    itemDescription : {
        type : String,
        required : true
    },
    itemStatus : {
        type : String,
        enum : ['Lost', 'Found'],
        required : true
    }
},
{
    timestamps : true
}); 

const LostnFound = mongoose.model('LostnFound', lostnFoundSchema);
module.exports = LostnFound;