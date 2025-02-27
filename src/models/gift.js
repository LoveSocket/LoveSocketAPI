const mongoose = require('mongoose');

const giftSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    giftType: {
        type: String,
        required: true,
        enum: ['flowers', 'chocolate', 'cake']
    },
    message: String,
    occasion: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Gift = mongoose.model('Gift', giftSchema);

module.exports = Gift;