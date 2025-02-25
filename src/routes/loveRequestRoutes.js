const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
    sendLoveRequest,
    acceptLoveRequest,
    rejectLoveRequest,
    getSentPendingLoveRequests,
    getReceivedPendingLoveRequests,
    cancelLoveRequest
} = require('../controllers/loveRequestController');

const router = express.Router();

router.use(authMiddleware);

router.post("/send-request", sendLoveRequest)
router.post("/accept-request", acceptLoveRequest)
router.post("/reject-request", rejectLoveRequest)
router.get("/get-sent-pending-request", getSentPendingLoveRequests)
router.get("/get-received-pending-request", getReceivedPendingLoveRequests)
router.post("/cancel-request", cancelLoveRequest)

module.exports = router;