require('dotenv/config');
const Report = require('../models/report');

// Create a new report
exports.reportUser = async (req, res) => {
    try {
        const { reportedUser, reportingUser, reason, description } = req.body;
        
        if (!reportingUser || !reportedUser || !reason) {
            return res.status(400).json({
                success: false, message: "Reported user, reporting user, and reason are required!"
            });
        }

        const report = new Report({ reportedUser, reportingUser, reason, description });
        await report.save();

        res.status(201).json({
            success: true, message: "Report successfully created!", data: report
        });
    } catch (err) {
        res.status(500).json({
            success: false, message: 'Internal server error', error: err.message
        });
    }
};

// Get all reports
exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().populate('reportedUser reportingUser', 'username email');
        if (!reports.length) {
            return res.status(400).json({
                success: false, message: "No requests found!"
            });
        }
        res.json({
            success: true, message: "Operation successful!", data: reports
        });
    } catch (err) {
        res.status(500).json({
            success: false, message: 'Internal server error', error: err.message
        });
    }
};

// Get a single report by ID
exports.getReportById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).json({
                success: false, error: "Request ID is required"
            });
        }
        
        const report = await Report.findById(id).populate('reportedUser reportingUser', 'username email');
        if (!report) {
            return res.status(404).json({
                success: false, error: "Report not found"
            });
        }

        res.json({
            success: true, message: "Operation successful!", data: report
        });
    } catch (err) {
        res.status(500).json({
            success: false, message: 'Internal server error', error: err.message
        });
    }
};
