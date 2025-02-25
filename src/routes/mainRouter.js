const userRouter = require('./userRoutes');
const reportRoutes = require('./reportRoutes')
const loveRequestRoutes = require('./loveRequestRoutes')
const messageRoutes = require('./messageRoutes')
const express = require('express');

const router = express.Router();

router.use('/users', userRouter);
router.use('/report', reportRoutes);
router.use('/loveRequest', loveRequestRoutes);
router.use('/message', messageRoutes);

module.exports = router;
