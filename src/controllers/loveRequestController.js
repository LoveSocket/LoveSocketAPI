const mongoose = require("mongoose");
const LoveRequest = require('../models/loveRequest');
const User = require('../models/user');

//Send love request
exports.sendLoveRequest = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({
        success: false, message: "Sender ID and Receiver ID are required!"
      });
    }

    if (senderId === receiverId) {
      return res.status(400).json({ 
        success: false, message: "You cannot send a love request to yourself!"
      });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver || receiver.isDeleted == true || receiver.deletedAt) {
      return res.status(400).json({
        success: false, message: "User does not exist or has been deleted!"
      });
    }

    const existingRequest = await LoveRequest.findOne({ senderId, receiverId });
    if (existingRequest) {
      return res.status(400).json({
        success: false, message: "Love request already sent!"
      });
    }

    const loveRequest = new LoveRequest({senderId, receiverId});
    await loveRequest.save();

    res.status(201).json({
      success: true, message: "Love request sent successfully!", data: loveRequest 
    });

  } catch (err) {
    res.status(500).json({
      success: false, message: 'Internal server error', error: err.message
    });
  }
}

//Accept love request
exports.acceptLoveRequest = async (req, res) => {
  try {
    const { requestId, receiverId } = req.body;

    if (!requestId || !receiverId) {
      return res.status(400).json({
        success: false, message: "Request ID and Receiver ID are required!"
      });
    }

    const loveRequest = await LoveRequest.findById(requestId);
    if (!loveRequest) {
      return res.status(400).json({
        success: false, message: "Love request not found!"
      });
    }

    if (loveRequest.receiverId != receiverId) {
      return res.status(403).json({
        success: false, message: "Only the receiver can accept or reject this request!"
      });
    }

    if (loveRequest.status != "Pending") {
      return res.status(400).json({
        success: false, message: "This love request has already been processed!"
      });
    }

    loveRequest.status = "Accepted"
    await loveRequest.save();

    return res.status(200).json({
      success: true, message: "Love request has been accepted!", data: loveRequest
    });

  } catch (err) {
    res.status(500).json({
      success: false, message: 'Internal server error', error: err.message
    });
  }
}

//Reject love request
exports.rejectLoveRequest = async (req, res) => {
  try {
    const { requestId, receiverId } = req.body;

    if (!requestId || !receiverId) {
      return res.status(400).json({
        success: false, message: "Request ID and Receiver ID are required!"
      });
    }

    const loveRequest = await LoveRequest.findById(requestId);
    if (!loveRequest) {
      return res.status(400).json({
        success: false, message: "Love request not found!"
      });
    }

    if (loveRequest.receiverId != receiverId) {
      return res.status(403).json({
        success: false, message: "Only the receiver can approve or reject this request!"
      });
    }

    if (loveRequest.status != "Pending") {
      return res.status(400).json({
        success: false, message: "This love request has already been processed!"
      });
    }

    loveRequest.status = "Rejected"
    await loveRequest.save();

    return res.status(200).json({
      success: true, message: "Love request has been rejected!", data: loveRequest
    });

  } catch (err) {
    res.status(500).json({
      success: false, message: 'Internal server error', error: err.message
    });
  }
}

//Get sent pending love requests
exports.getSentPendingLoveRequests = async (req, res) => {
  try {
    const { userId } = req.userInfo;

    if (!userId) {
      return res.status(400).json({
        success: false, message: "User ID is missing!"
      })
    }
    
    const loveRequest = await LoveRequest.find({
      senderId: userId,
      status: "Pending"
    }).populate("receiverId", "firstName lastName username gender age hobbies bio location occupation picture");;
    
    if (!loveRequest.length) {
      return res.status(400).json({
        success: false, message: "No pending love requests found!"
      });
    }

    const loveRequestResponse = loveRequest.map(request => ({
      id: request._id,
      senderId: request.senderId,
      status: request.status,
      receiver: {
        id: request.receiverId._id,
        name: `${request.receiverId.firstName} ${request.receiverId.lastName}`,
        username: request.receiverId.username,
        gender: request.receiverId.gender,
        age: request.receiverId.age,
        hobbies: request.receiverId.hobbies,
        bio: request.receiverId.bio,
        location: request.receiverId.location,
        occupation: request.receiverId.occupation,
        picture: request.receiverId.picture
      },
    }))

    res.status(200).json({
      success: true, message: "Operation successful", data: loveRequestResponse
    });

  } catch (err) {
    res.status(500).json({
      success: false, message: 'Internal server error', error: err.message
    });
  }
}

//Get received pending love requests
exports.getReceivedPendingLoveRequests = async (req, res) => {
  try {
    const { userId } = req.userInfo;

    if (!userId) {
      return res.status(400).json({
        success: false, message: "User ID is missing!"
      })
    }

    const loveRequest = await LoveRequest.find({
      receiverId: userId,
      status: "Pending"
    }).populate("senderId", "firstName lastName username gender age hobbies bio location occupation picture");
    
    if (!loveRequest.length) {
      return res.status(400).json({
        success: false, message: "No pending love requests found!"
      });
    }

    const loveRequestResponse = loveRequest.map(request => ({
      id: request._id,
      receiverId: request.receiverId,
      status: request.status,
      sender: {
        id: request.senderId._,
        name: `${request.senderId.firstName} ${request.senderId.lastName}`,
        username: request.senderId.username,
        gender: request.senderId.gender,
        age: request.senderId.age,
        hobbies: request.senderId.hobbies,
        bio: request.senderId.bio,
        location: request.senderId.location,
        occupation: request.senderId.occupation,
        picture: request.senderId.picture
      },
    }))
    res.status(200).json({
      success: true, message: "Operation successful", data: loveRequestResponse
    });
  } catch (err) {
    res.status(500).json({
      success: false, message: 'Internal server error', error: err.message
    });
  }
}

//Cancel sent love request
exports.cancelLoveRequest = async (req, res) => {
  try {
    const { requestId, senderId } = req.body;

    if (!requestId || !senderId) {
      return res.status(400).json({
        success: false, message: "Request ID and sender ID are required!"
      });
    }

    const loveRequest = await LoveRequest.findById(requestId);
    if (!loveRequest) {
      return res.status(400).json({
        success: false, message: "Love request not found!"
      });
    }

    if (loveRequest.senderId != senderId) {
      return res.status(403).json({
        success: false, message: "Only the sender can cancel this request!"
      });
    }

    if (loveRequest.status != "Pending") {
      return res.status(400).json({
        success: false, message: "This love request has already been processed!"
      });
    }

    loveRequest.status = "Cancelled"
    await loveRequest.save();

    return res.status(200).json({
      success: true, message: "Love request has been Cancelled!", data: loveRequest
    });
  } catch (err) {
    res.status(500).json({
      success: false, message: 'Internal server error', error: err.message
    });
  }
}

