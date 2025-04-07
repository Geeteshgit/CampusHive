const express = require("express");
const { register, login, logout, getCurrentUser } = require("../controllers/auth.controller.js");
const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/user", getCurrentUser);

module.exports = router;
