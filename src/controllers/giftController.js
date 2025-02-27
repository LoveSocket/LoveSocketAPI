const User = require('../models/user');
const Gift = require('../models/gift');

//Send gift
const sendGift = async (req, res) => {
    try {
        const { receiverId, giftType, message, occasion } = req.body;
        const senderId = req.userInfo.userId;

        const receiver = await User.findById(receiverId);
        if (!receiver || receiver.isDeleted == true || receiver.deletedAt) {
            return res.status(400).json({
                success: false, message:  "User does not exist or has been deleted!"
            });
        }

        const newGift = new Gift({
            senderId,
            receiverId,
            giftType,
            message,
            occasion
        });

        await newGift.save();

        return res.status(201).json({
            success: true, message: 'Gift sent successfully', data: newGift
        });
    } catch (err) {
        return res.status(500).json({
            success: false, message: 'Internal server error', error: err.message
        });
    }
};

//Get gifts
const getUserGifts = async (req, res) => {
    try {
        const userId = req.userInfo.userId;

        const gifts = await Gift.find({ receiverId: userId })
                            .populate('senderId')
                            .sort({ createdAt: -1 });
        
        return res.status(200).json({
            success: true, message: 'Gifts retrieved successfully', data: gifts
        });
    } catch (err) {
        return res.status(500).json({
            success: false, message: 'Internal server error', error: err.message
        });
    }
};

module.exports = {
    sendGift,
    getUserGifts
};