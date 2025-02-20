const userRouter = require('./userRoutes');
const express = require('express');

const router = express.Router();

router.use('/users', userRouter);

module.exports = router;