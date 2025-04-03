const express = require("express");
const router = express.Router();
const { getUser, getSelectedUser, updateUser, deleteUser } = require("../controllers/user.controller.js");
const checkAuth = require("../middlewares/checkAuth.js");
const { uploadLimit } = require('../middlewares/multerConfig.js');

router.get('/', checkAuth, getUser);
router.get('/:id', checkAuth, getSelectedUser);
router.put('/', checkAuth , uploadLimit.single('image'), updateUser);
router.delete('/', checkAuth, deleteUser);

module.exports = router;