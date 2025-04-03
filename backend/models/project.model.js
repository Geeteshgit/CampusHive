const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    technologies : {
        type : String,
        required : true
    },
    lookingFor : {
        type : String,
        required : true
    },
},
{
    timestamps : true
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;