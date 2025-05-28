const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3002;

const userRoutes = require('./routes/users');
const db = require('./data/db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);

app.get('/server/health', (req, res) => {
    return res.send("Server happy and running ...");
});

db().then(() => {
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
}).catch((err) => {
    console.error("Database connection failed", err);
});

module.exports = app;
