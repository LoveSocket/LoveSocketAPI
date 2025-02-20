require('dotenv/config');
const express = require('express');
const connectToDB = require('./src/config/db');
const router = require('./src/routes/mainRouter');

const app = express();

connectToDB();

app.use(express.json());
app.use('/api/v1/love-island', router);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});