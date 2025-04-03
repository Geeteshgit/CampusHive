const express = require("express");
const router = express.Router();

const { getAllRentals, getUserRentals, postRental, deleteRental } = require("../controllers/carrental.controller.js");
const checkAuth = require("../middlewares/checkAuth.js");
const { uploadLimit } = require('../middlewares/multerConfig.js');

router.get('/', getAllRentals);
router.post('/', checkAuth, uploadLimit.single('vehicleImage'), postRental);
router.delete('/:id', checkAuth, deleteRental);
router.get('/myrentals', checkAuth, getUserRentals);

module.exports = router;