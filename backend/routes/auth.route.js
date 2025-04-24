const express = require("express");
const { register, login, logout, getCurrentUser, googleLogin } = require("../controllers/auth.controller.js");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/user", getCurrentUser);
router.post('/google', googleLogin);

module.exports = router;
