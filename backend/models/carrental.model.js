const mongoose = require("mongoose");

const carRentalSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    vehicleImage : {
        type : String,
        required : true,
    },
    vehicleModel : {
        type : String,
        required : true
    },
    vehicleDescription : {
        type : String,
        required : true
    },
    rentalPeriod : {
        type : String,
        required : true
    },
    rentalAmount : {
        type : String,
        required : true
    },
    vehicleMileage : {
        type : String,
        required : true
    }
},
{
    timestamps : true
});

const CarRental = mongoose.model('CarRental', carRentalSchema);
module.exports = CarRental;