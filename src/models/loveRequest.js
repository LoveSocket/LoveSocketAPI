const mongoose = require('mongoose');

const loveRequestSchema = mongoose.Schema({
  senderId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  receiverId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status:{
    type: String,
    enum: ["Pending", "Accepted", "Rejected", "Cancelled"],
    default: "Pending"
  }
}, {timestamps: true});

const LoveRequest = mongoose.model("LoveRequest", loveRequestSchema);

module.exports = LoveRequest;