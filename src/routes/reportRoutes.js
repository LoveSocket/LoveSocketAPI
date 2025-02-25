const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { reportUser, getAllReports, getReportById } = require('../controllers/reportController');

const router = express.Router();

router.use(authMiddleware);

router.post('/report-user', reportUser);
router.get('/get-all-reports', getAllReports);
router.get('/get-report/:id', getReportById);

module.exports = router;
