require('dotenv/config');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signUp = async (req, res) => {
    try {
        const { 
            firstName, 
            lastName, 
            username, 
            email, 
            password, 
            gender,
            age
        } = req.body;

        const isExistingUser = await User.findOne({$or: [{username}, {email}]});
    
        if (isExistingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists.'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            username,
            password: hashedPassword,
            gender,
            age
        });

        await newUser.save();
        return res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });
        
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
    
};

const signIn = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({$or: [{username}, {email}]});

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User does not exist'
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const accessToken = jwt.sign({
            userId: user._id
        }, process.env.JWT_SECRET_KEY,{
            expiresIn: '10m'
        });

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            accessToken
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId, updates, {
            new: true , runValidators: true
        });

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            updatedUser: updatedUser
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

const getUsersByInterest = async (req, res) => {
    try {
        const interestedIn = req.query.interestedIn;

        if (!interestedIn) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an interestedIn value.'
            });
        }

        const users = await User.find({ gender: interestedIn });

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No users found for the given interest.'
            });
        }

        res.status(200).json({ 
            success: true,
            users
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

const getUsersByHobby = async (req, res) => {
    try {
        const hobby = req.query.hobby;

        if (!hobby) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a hobby to search for.'
            });
        }

        const users = await User.find({ hobbies: { $in: [hobby] } });

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No users found with the specified hobby.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            users
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'User fetched successfully',
            user: user
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

const deleteUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.isDeleted = true;
        await user.save();
        return res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            user: user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

module.exports = {
    signUp,
    signIn,
    updateUser,
    getUsersByInterest,
    getUsersByHobby,
    getUserById,
    deleteUserById
};