require('dotenv/config');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Sign-up
const signUp = async (req, res) => {
    try {
        const { 
            firstName, 
            lastName, 
            username, 
            email, 
            password, 
            gender,
            age,
            phone,
            bio,
            interestedIn,
            hobbies,
            occupation,
            location,
            stateOfOrigin,
            isRich,
            picture
        } = req.body;

        if (!firstName || !lastName || !username || !email || !password || !gender || !age) {
            return res.status(400).json({
                success: false, message: 'Please input all required fields'
            });
        }

        const isExistingUser = await User.findOne({$or: [{username}, {email}]});
    
        if (isExistingUser) {
            return res.status(400).json({
                success: false, message: 'User already exists.'
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
            age,
            phone,
            bio,
            interestedIn,
            hobbies,
            occupation,
            location,
            stateOfOrigin,
            isRich,
            picture
        });

        await newUser.save();
        return res.status(201).json({
            success: true, message: 'User registered successfully'
        });
        
    } catch (err) {
        res.status(500).json({
            success: false, message: 'Internal server error', error: err.message
        });
    }
    
};

//Sign-in
const signIn = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({$or: [{username}, {email}]});

        if ((!username && !email) || !password) {
            return res.status(400).json({
                success: false, message: 'Please input both fields'
            });
        }

        if (!user || user.isDeleted == true || user.deletedAt) {
            return res.status(400).json({
                success: false, message: 'User does not exist'
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false, message: 'Invalid credentials'
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
            data: {
                id: user._id,
                firstName: user.firstname,
                lastName: user.lastName,
                userName: user.userName,
                email: user.email,
                gender: user.gender,
                accessToken
            }
        });

    } catch (err) {
        res.status(500).json({
            success: false, message: 'Internal server error', error: err.message
        });
    }
};

//Update user
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { bio, interestedIn, hobbies, occupation, location, isRich, picture } = req.body;
        
        const updates = {};
        if (bio) updates.bio = bio;
        if (interestedIn) updates.interestedIn = interestedIn;
        if (hobbies) updates.hobbies = hobbies;
        if (occupation) updates.occupation = occupation;
        if (location) updates.location = location;
        if (typeof isRich === 'boolean') updates.isRich = isRich;
        if (picture) updates.picture = picture;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false, message: 'No updates provided'
            });
        }

        const user = await User.findById(userId);
        if (!user || user.isDeleted == true || user.deletedAt) {
            return res.status(404).json({
                success: false, message: 'User not found'
            });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updates, {
            new: true , runValidators: true
        });

        return res.status(200).json({
            success: true, message: 'Profile updated successfully', data: updates
        });

    } catch (err) {
        res.status(500).json({
            success: false, message: 'Internal server error', error: err.message
        });
    }
};

//Get users by interest
const getUsersByInterest = async (req, res) => {
    try {
        const interestedIn = req.query.interestedIn;

        if (!interestedIn) {
            return res.status(400).json({
                success: false, message: 'Please provide an interestedIn value.'
            });
        }

        const users = await User.find({ 
            gender: interestedIn,
            isDeleted: { $ne: true },
        });

        if (users.length === 0) {
            return res.status(404).json({
                success: false, message: 'No users found for the given interest.'
            });
        }

        const formattedUsers = users.map(user => ({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            gender: user.gender,
            age: user.age,
            hobbies: user.hobbies,
            bio: user.bio,
            interestedIn: user.interestedIn,
            isRich: user.isRich,
            location: user.location,
            occupation: user.occupation,
            picture: user.picture,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));

        res.status(200).json({ 
            success: true, message: "Operation successful", data: formattedUsers
        });

    } catch (err) {
        res.status(500).json({
            success: false, message: 'Internal server error', error: err.message
        });
    }
};

//Get users by hobby
const getUsersByHobby = async (req, res) => {
    try {
        const hobby = req.query.hobby;

        if (!hobby) {
            return res.status(400).json({
                success: false, message: 'Please provide a hobby to search for.'
            });
        }

        const users = await User.find({
            hobbies: { $in: [hobby] },
            isDeleted: { $ne: true },
        });

        if (users.length === 0) {
            return res.status(404).json({
                success: false, message: 'No users found with the specified hobby.'
            });
        }

        const formattedUsers = users.map(user => ({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            gender: user.gender,
            age: user.age,
            hobbies: user.hobbies,
            bio: user.bio,
            interestedIn: user.interestedIn,
            isRich: user.isRich,
            location: user.location,
            occupation: user.occupation,
            picture: user.picture,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));

        res.status(200).json({
            success: true, message: 'Users fetched successfully', data: formattedUsers
        });
    } catch (err) {
        res.status(500).json({
            success: false, message: 'Internal server error', error: err.message
        });
    }
};

//Get user by id
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!userId) {
            return res.status(404).json({
                success: false, message: 'Provide userId'
            });
        }

        if (!user || user.isDeleted == true || user.deletedAt) {
            return res.status(404).json({
                success: false, message: 'User not found'
            });
        }

        const formattedUser = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            gender: user.gender,
            age: user.age,
            hobbies: user.hobbies,
            bio: user.bio,
            interestedIn: user.interestedIn,
            isRich: user.isRich,
            location: user.location,
            occupation: user.occupation,
            picture: user.picture,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        return res.status(200).json({
            success: true, message: 'User fetched successfully', data: formattedUser
        });

    } catch (err) {
        res.status(500).json({
            success: false, message: 'Internal server error', error: err.message
        });
    }
};

//Delete user by id
const deleteUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user || user.isDeleted == true || user.deletedAt) {
            return res.status(404).json({
                success: false, message: 'User not found'
            });
        }

        user.isDeleted = true;
        user.deletedAt = new Date();
        await user.save();

        return res.status(200).json({
            success: true, message: 'User deleted successfully',
        });
    } catch (err) {
        res.status(500).json({
            success: false, message: 'Internal server error', error: err.message
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