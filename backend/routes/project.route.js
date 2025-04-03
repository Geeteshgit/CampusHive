const express = require("express");
const router = express();

const { getAllProjects, getUserProjects ,postProject, deleteProject } = require("../controllers/project.controller.js");
const checkAuth = require("../middlewares/checkAuth.js");

router.get('/', getAllProjects);
router.post('/', checkAuth, postProject);
router.delete('/:id', checkAuth, deleteProject);
router.get('/userprojects',checkAuth, getUserProjects);

module.exports = router;