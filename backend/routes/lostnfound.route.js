const express = require("express");
const router = express.Router();

const { getUserItems, getAllItems, postItem, deleteItem } = require("../controllers/lostnfound.controller.js");
const checkAuth = require("../middlewares/checkAuth.js");
const { uploadLimit } = require('../middlewares/multerConfig.js');

router.get('/', getAllItems);
router.post('/', checkAuth, uploadLimit.single('itemImage'), postItem);
router.delete('/:id', checkAuth, deleteItem);
router.get('/myitems', checkAuth, getUserItems);

module.exports = router;