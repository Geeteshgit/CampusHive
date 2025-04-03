const express = require('express');
const router = express.Router();

const { getPublicMessages, 
        sendPublicMessages, 
        getPrivateMessages, 
        sendPrivateMessages,
        getUserConversations } = require("../controllers/message.controller.js");
const checkAuth = require('../middlewares/checkAuth.js');
const { upload } = require("../middlewares/multerConfig.js");

router.get('/public', checkAuth, getPublicMessages);
router.post('/public', checkAuth, upload.single('file'), sendPublicMessages);

router.get('/dm/:userId', checkAuth, getPrivateMessages);
router.post('/dm/:receiverId', checkAuth, upload.single('file'), sendPrivateMessages);

router.get("/conversations", checkAuth, getUserConversations);

module.exports = router;