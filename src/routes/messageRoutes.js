const express = require("express");
const authMiddleware = require('../middleware/authMiddleware');
const {
    sendMessage,
    getMessages,
    updateMessage,
    deleteMessage,
    markAsRead
}= require("../controllers/messageController");

const router = express.Router();

router.use(authMiddleware);

router.post("/", sendMessage);
router.get("/:senderId/:receiverId", getMessages);
router.put("/update", updateMessage);
router.delete("/:messageId", deleteMessage);
router.patch("/read/:messageId", markAsRead);

module.exports = router;
