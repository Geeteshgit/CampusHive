const express =  require("express");
const router = express.Router();
const { getAllCarpools, getUserRides,  postCarpool, deleteCarpool } = require("../controllers/carpool.controller.js");
const checkAuth = require("../middlewares/checkAuth.js");

router.get('/', getAllCarpools);
router.get('/rides', checkAuth, getUserRides);
router.post('/', checkAuth, postCarpool);
router.delete('/:id', checkAuth, deleteCarpool);


module.exports = router;