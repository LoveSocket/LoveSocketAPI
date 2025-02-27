const userRoutes = require('./userRoutes');
const reportRoutes = require('./reportRoutes')
const loveRequestRoutes = require('./loveRequestRoutes')
const messageRoutes = require('./messageRoutes')
const giftRoutes = require('./giftRoutes');
const express = require('express');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/report', reportRoutes);
router.use('/loveRequest', loveRequestRoutes);
router.use('/message', messageRoutes);
router.use('/gifts', giftRoutes);

module.exports = router;
