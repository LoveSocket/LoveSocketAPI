const userRouter = require('./userRoutes');
const reportRoutes = require('./reportRoutes')
const express = require('express');

const router = express.Router();

router.use('/users', userRouter);
router.use('/report', reportRoutes);

module.exports = router;
