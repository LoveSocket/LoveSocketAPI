require('dotenv/config');
const Report = require('../models/report');

// Create a new report
exports.createReport = async (req, res) => {
    try {
        const { reportedUser, reportingUser, reason, description } = req.body;
        const report = new Report({ reportedUser, reportingUser, reason, description });
        await report.save();
        res.status(201).json(report);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all reports
exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().populate('reportedUser reportingUser', 'username email');
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single report by ID
exports.getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id).populate('reportedUser reportingUser', 'username email');
        if (!report) return res.status(404).json({ error: "Report not found" });
        res.json(report);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
