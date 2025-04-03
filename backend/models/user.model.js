const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    profilePhoto : {
        type : String,
        default : "/user.jpg"
    },
    carpools : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'CarPool',
        default : []
    },
    lostnfounds : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'LostnFound',
        default : []
    },
    carrentals : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'CarRental',
        default : []
    },
    projects: {
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'Project',
        default : []
    }
},
{
    timestamps : true
});

const User = mongoose.model('User', userSchema);
module.exports = User;