const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required :true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // gender:  {
    //     type: String,
    //     required: true
    // },
    gender: 
    {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true 
    },
    age: Number,
    phone: String,
    bio: String,
    // interestedIn: String,
    interestedIn: 
    {
        type: String, 
        enum: ["Male", "Female", "Other"]
    },
    hobbies: [String],
    occupation: String,
    dob: Date,
    location: String,
    stateOfOrigin: String,
    isRich: Boolean,
    picture: String,
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;