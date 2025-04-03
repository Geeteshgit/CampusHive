const Project = require("../models/project.model");
const User = require("../models/user.model");

const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find()
        .populate('user', '_id');
        return res.status(200).json(projects);
    } catch (err) {
        console.error("Get All Projects Error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getUserProjects = async (req, res) => {    
    try {
        const user = req.user;
        const populatedUser = await user.populate('projects');
        const userProjects = populatedUser.projects;
        return res.status(200).json(userProjects);
    } catch (err) {
        console.error("Get User Projects Error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const postProject = async (req, res) => {
    try {
        const user = req.user;
        const { title, description, technologies, lookingFor } = req.body;
        
        if(!title || !description || !technologies || !lookingFor){
            return res.status(400).json({ message: "All fields are required!" });
        }
    
        const project = await Project.create({
            user : user._id,
            title,
            description,
            technologies,
            lookingFor,
        });

        user.projects.push(project._id);
        await user.save();
        
        return res.status(201).json(project);
    } catch (err) {
        console.error("Post Project Error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const deleteProject = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;

        const deletedProject = await Project.findOneAndDelete({_id : id});
        if (!deletedProject) return res.status(404).json({ message: "No project found!" });

        await User.findOneAndUpdate({ _id : user._id}, { $pull : { projects : id }});
        return res.status(200).json({ message: "Project deleted successfully", deletedProject });
    } catch (err) {
        console.error("Delete Project Error:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { getAllProjects,getUserProjects, postProject, deleteProject }