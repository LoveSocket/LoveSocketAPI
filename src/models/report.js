const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    reportingUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true, enum: ["Harassment", "Scam", "Fake Profile", "Other"] },
    description: { type: String },
    date: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;
