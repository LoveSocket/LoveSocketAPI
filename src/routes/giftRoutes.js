const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { sendGift, getUserGifts } = require('../controllers/giftController');

const router = express.Router();

router.use(authMiddleware);

router.post('/send-gift', sendGift);

router.get('/my-gifts', getUserGifts);

module.exports = router;