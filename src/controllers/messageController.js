const mongoose = require("mongoose");
const Message = require('../models/message');
const User = require('../models/user');
const LoveRequest = require('../models/loveRequest');

//Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({
        success: false, message: "Sender ID and Receiver ID are required!"
      });
    }

    const isMatched = await LoveRequest.findOne({
      $or: [
        { senderId: senderId, receiverId: receiverId, status: "Accepted" },
        { senderId: receiverId, receiverId: senderId, status: "Accepted" }
      ]
    });
    
    if (!isMatched) {
      return res.status(400).json({
        success: false, message: "Both parties must have accepted each other's love request to perform this operation!"
      });
    }
    
    const receiver = await User.findById(receiverId);
    if (!receiver || receiver.isDeleted == true || receiver.deletedAt) {
      return res.status(400).json({
        success: false, message: "Receiver does not exist or has been deleted!"
      });
    }

    const newMessage = new Message({ senderId, receiverId, message, read: false });

    await newMessage.save();

    res.status(200).json({
      success: true, message: "Message sent!", data: newMessage
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, message: "Failed to send message",error: error.message 
    });
  }
};

// Get messages between two users
exports.getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    if (!senderId || !receiverId) {
      return res.status(400).json({
        success: false, message: "Sender ID and Receiver ID are required!"
      });
    }

    const isMatched = await LoveRequest.findOne({
      $or: [
        { senderId: senderId, receiverId: receiverId, status: "Accepted" },
        { senderId: receiverId, receiverId: senderId, status: "Accepted" }
      ]
    });
    
    if (!isMatched) {
      return res.status(400).json({
        success: false, message: "Both parties must have accepted each other's love request to perform this operation!"
      });
    }    

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json({ success: true, messages });

  } catch (error) {
    res.status(500).json({ 
      success: false, message: "Failed to fetch messages", error: error.message
    });
  }
};

// Update a message
exports.updateMessage = async (req, res) => {
  try {
    const { messageId, updatedMessage } = req.body;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    if (message.senderId.toString() !== req.userId.toString()) {
      return res.status(403).json({ 
        success: false, message: "You can only edit your own messages"
      });
    }

    message.message = updatedMessage;
    await message.save();

    res.status(200).json({ success: true, message: "Message updated!", data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update message", error: error.message });
  }
};

// Delete a message (for sender only)
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    if (message.senderId.toString() !== req.userId.toString()) {
      return res.status(403).json({ success: false, message: "You can only delete your own messages" });
    }

    message.isDeleted = true;
    await message.save();

    res.status(200).json({ success: true, message: "Message deleted!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete message", error: error.message });
  }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    message.read = true;
    await message.save();

    res.status(200).json({ success: true, message: "Message marked as read", data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to mark message as read", error: error.message });
  }
};