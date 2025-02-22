const express = require('express');
const { createReport, getAllReports, getReportById } = require('../controllers/reportController');

const router = express.Router();

router.post('/report', createReport);
router.get('/reports', getAllReports);
router.get('/report/:id', getReportById);

module.exports = router;
